import {
  imageHeaderReadBytes,
  readImageDimensions,
  type SupportedImageMime,
  validateImageDimensions,
} from "../image-compressor/logic";

type InspectRequest = {
  readonly type: "inspect";
  readonly id: number;
  readonly file: File;
  readonly mimeType: SupportedImageMime;
};

type ConvertRequest = {
  readonly type: "convert";
  readonly id: number;
  readonly file: File;
  readonly outputType: SupportedImageMime;
  readonly quality: number;
  readonly background: string;
};

type ResizeRequest = {
  readonly type: "resize";
  readonly id: number;
  readonly file: File;
  readonly outputType: SupportedImageMime;
  readonly quality: number;
  readonly background: string;
  readonly width: number;
  readonly height: number;
};

type CropRequest = {
  readonly type: "crop";
  readonly id: number;
  readonly file: File;
  readonly outputType: SupportedImageMime;
  readonly quality: number;
  readonly background: string;
  readonly crop: { readonly x: number; readonly y: number; readonly width: number; readonly height: number };
};

type WorkerRequest = InspectRequest | ConvertRequest | ResizeRequest | CropRequest;

function send(message: object) {
  postMessage(message);
}

function supported() {
  return (
    typeof OffscreenCanvas !== "undefined" &&
    typeof createImageBitmap !== "undefined"
  );
}

async function inspect(request: InspectRequest) {
  if (!supported()) {
    send({
      type: "error",
      id: request.id,
      message:
        "This browser cannot inspect images locally. Try a current browser.",
    });
    return;
  }
  let bitmap: ImageBitmap | undefined;
  try {
    const header = new Uint8Array(
      await request.file.slice(0, imageHeaderReadBytes).arrayBuffer(),
    );
    const dimensions = readImageDimensions(header, request.mimeType);
    const validationError =
      dimensions &&
      validateImageDimensions(dimensions.width, dimensions.height);
    if (!dimensions || validationError) {
      send({
        type: "error",
        id: request.id,
        message:
          validationError ??
          "This image could not be read. Choose a valid PNG, JPG, or WebP file.",
      });
      return;
    }
    bitmap = await createImageBitmap(request.file, {
      imageOrientation: "from-image",
    });
    const decodedValidationError = validateImageDimensions(
      bitmap.width,
      bitmap.height,
    );
    if (decodedValidationError) {
      send({ type: "error", id: request.id, message: decodedValidationError });
      return;
    }
    send({
      type: "inspected",
      id: request.id,
      width: bitmap.width,
      height: bitmap.height,
    });
  } catch {
    send({
      type: "error",
      id: request.id,
      message:
        "This image could not be read. Choose a valid PNG, JPG, or WebP file.",
    });
  } finally {
    bitmap?.close();
  }
}

async function render(
  request: ConvertRequest | ResizeRequest | CropRequest,
  targetWidth?: number,
  targetHeight?: number,
) {
  if (!supported()) {
    send({
      type: "error",
      id: request.id,
      message:
        "This browser cannot convert images locally. Try a current browser.",
    });
    return;
  }
  let bitmap: ImageBitmap | undefined;
  try {
    bitmap = await createImageBitmap(request.file, {
      imageOrientation: "from-image",
    });
    const crop = request.type === "crop" ? request.crop : undefined;
    const canvas = new OffscreenCanvas(
      targetWidth ?? crop?.width ?? bitmap.width,
      targetHeight ?? crop?.height ?? bitmap.height,
    );
    const context = canvas.getContext("2d", {
      alpha: request.outputType !== "image/jpeg",
    });
    if (!context) throw new Error();
    if (request.outputType === "image/jpeg") {
      context.fillStyle = request.background;
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
    if (crop) {
      context.drawImage(
        bitmap,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        canvas.width,
        canvas.height,
      );
    } else {
      context.drawImage(
        bitmap,
        0,
        0,
        targetWidth ?? bitmap.width,
        targetHeight ?? bitmap.height,
      );
    }
    const blob = await canvas.convertToBlob({
      type: request.outputType,
      quality:
        request.outputType === "image/png" ? undefined : request.quality / 100,
    });
    if (blob.type !== request.outputType) throw new Error();
    send({ type: "result", id: request.id, blob });
  } catch {
    send({
      type: "error",
      id: request.id,
      message:
        "The image could not be processed. It may be corrupted or unsupported.",
    });
  } finally {
    bitmap?.close();
  }
}

addEventListener("message", (event: MessageEvent<WorkerRequest>) => {
  if (event.data.type === "inspect") {
    void inspect(event.data);
  } else if (event.data.type === "resize") {
    void render(event.data, event.data.width, event.data.height);
  } else {
    void render(event.data);
  }
});
