import {
  imageHeaderReadBytes,
  readImageDimensions,
  type SupportedImageMime,
  validateImageDimensions,
} from "../image-compressor/logic";
import {
  createIco,
  faviconPngSizes,
  getFaviconPngName,
} from "../favicon-generator/logic";

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
  readonly crop: {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
  };
};

type RotateRequest = {
  readonly type: "rotate";
  readonly id: number;
  readonly file: File;
  readonly outputType: SupportedImageMime;
  readonly quality: number;
  readonly background: string;
  readonly rotation: 0 | 90 | 180 | 270;
  readonly flipHorizontal: boolean;
  readonly flipVertical: boolean;
};

type FaviconRequest = {
  readonly type: "favicon";
  readonly id: number;
  readonly file: File;
};

type WorkerRequest =
  | InspectRequest
  | ConvertRequest
  | ResizeRequest
  | CropRequest
  | RotateRequest
  | FaviconRequest;

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

async function renderRotated(request: RotateRequest) {
  if (!supported()) {
    send({
      type: "error",
      id: request.id,
      message:
        "This browser cannot transform images locally. Try a current browser.",
    });
    return;
  }
  let bitmap: ImageBitmap | undefined;
  try {
    bitmap = await createImageBitmap(request.file, {
      imageOrientation: "from-image",
    });
    const swapsDimensions = request.rotation === 90 || request.rotation === 270;
    const canvas = new OffscreenCanvas(
      swapsDimensions ? bitmap.height : bitmap.width,
      swapsDimensions ? bitmap.width : bitmap.height,
    );
    const context = canvas.getContext("2d", {
      alpha: request.outputType !== "image/jpeg",
    });
    if (!context) throw new Error();
    if (request.outputType === "image/jpeg") {
      context.fillStyle = request.background;
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
    context.translate(canvas.width / 2, canvas.height / 2);
    context.rotate((request.rotation * Math.PI) / 180);
    context.scale(
      request.flipHorizontal ? -1 : 1,
      request.flipVertical ? -1 : 1,
    );
    context.drawImage(bitmap, -bitmap.width / 2, -bitmap.height / 2);
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
        "The image could not be transformed. It may be corrupted or unsupported.",
    });
  } finally {
    bitmap?.close();
  }
}

async function renderFavicons(request: FaviconRequest) {
  if (!supported()) {
    send({
      type: "error",
      id: request.id,
      message:
        "This browser cannot create favicons locally. Try a current browser.",
    });
    return;
  }
  let bitmap: ImageBitmap | undefined;
  try {
    bitmap = await createImageBitmap(request.file, {
      imageOrientation: "from-image",
    });
    const validationError = validateImageDimensions(
      bitmap.width,
      bitmap.height,
    );
    if (validationError) throw new Error(validationError);
    const assets: { name: string; size: number; blob: Blob }[] = [];
    for (const size of faviconPngSizes) {
      const canvas = new OffscreenCanvas(size, size);
      const context = canvas.getContext("2d", { alpha: true });
      if (!context) throw new Error();
      const scale = Math.min(size / bitmap.width, size / bitmap.height);
      const width = bitmap.width * scale;
      const height = bitmap.height * scale;
      context.drawImage(
        bitmap,
        (size - width) / 2,
        (size - height) / 2,
        width,
        height,
      );
      const blob = await canvas.convertToBlob({ type: "image/png" });
      if (blob.type !== "image/png") throw new Error();
      assets.push({ name: getFaviconPngName(size), size, blob });
    }
    const icoImages = await Promise.all(
      assets
        .filter(
          (asset) =>
            asset.size === 16 || asset.size === 32 || asset.size === 48,
        )
        .map(async (asset) => ({
          size: asset.size as 16 | 32 | 48,
          data: new Uint8Array(await asset.blob.arrayBuffer()),
        })),
    );
    const ico = new Blob([createIco(icoImages)], { type: "image/x-icon" });
    send({ type: "favicon-result", id: request.id, assets, ico });
  } catch {
    send({
      type: "error",
      id: request.id,
      message:
        "The favicon package could not be created. Choose a valid PNG, JPG, JPEG, or WebP image.",
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
  } else if (event.data.type === "rotate") {
    void renderRotated(event.data);
  } else if (event.data.type === "favicon") {
    void renderFavicons(event.data);
  } else {
    void render(event.data);
  }
});
