import {
  imageHeaderReadBytes,
  readImageDimensions,
  type SupportedImageMime,
  validateImageDimensions,
} from "./logic";

interface InspectRequest {
  readonly type: "inspect";
  readonly id: number;
  readonly file: File;
  readonly mimeType: SupportedImageMime;
}

interface ReencodeRequest {
  readonly type: "compress" | "reencode";
  readonly id: number;
  readonly file: File;
  readonly mimeType: SupportedImageMime;
  readonly quality: number;
}

type WorkerRequest = InspectRequest | ReencodeRequest;

interface InspectionResult {
  readonly type: "inspected";
  readonly id: number;
  readonly width: number;
  readonly height: number;
}

interface CompressionResult {
  readonly type: "result";
  readonly id: number;
  readonly blob: Blob;
}

interface CompressionFailure {
  readonly type: "error";
  readonly id: number;
  readonly message: string;
}

function send(
  message: InspectionResult | CompressionResult | CompressionFailure,
) {
  postMessage(message);
}

function supportsNativeImagePipeline() {
  return (
    typeof OffscreenCanvas !== "undefined" &&
    typeof createImageBitmap !== "undefined"
  );
}

async function inspect(request: InspectRequest) {
  if (!supportsNativeImagePipeline()) {
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
    const encodedDimensions = readImageDimensions(header, request.mimeType);
    if (!encodedDimensions) {
      throw new Error("Image dimensions could not be read.");
    }
    const dimensionError = validateImageDimensions(
      encodedDimensions.width,
      encodedDimensions.height,
    );
    if (dimensionError) {
      send({ type: "error", id: request.id, message: dimensionError });
      return;
    }

    bitmap = await createImageBitmap(request.file, {
      imageOrientation: "from-image",
    });
    const decodedDimensionError = validateImageDimensions(
      bitmap.width,
      bitmap.height,
    );
    if (decodedDimensionError) {
      send({ type: "error", id: request.id, message: decodedDimensionError });
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

async function reencode(request: ReencodeRequest) {
  if (!supportsNativeImagePipeline()) {
    send({
      type: "error",
      id: request.id,
      message:
        "This browser cannot compress images locally. Try a current browser.",
    });
    return;
  }

  let bitmap: ImageBitmap | undefined;
  try {
    bitmap = await createImageBitmap(request.file, {
      imageOrientation: "from-image",
    });
    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) throw new Error("The image canvas could not be created.");

    context.drawImage(bitmap, 0, 0);
    const blob = await canvas.convertToBlob({
      type: request.mimeType,
      quality:
        request.mimeType === "image/png" ? undefined : request.quality / 100,
    });

    if (blob.type !== request.mimeType) {
      throw new Error(
        "This browser could not create the requested image format.",
      );
    }

    send({ type: "result", id: request.id, blob });
  } catch {
    send({
      type: "error",
      id: request.id,
      message:
        request.type === "compress"
          ? "The image could not be compressed. It may be corrupted or unsupported."
          : "The image could not be exported. It may be corrupted or unsupported.",
    });
  } finally {
    bitmap?.close();
  }
}

addEventListener("message", (event: MessageEvent<WorkerRequest>) => {
  if (event.data.type === "inspect") {
    void inspect(event.data);
    return;
  }
  void reencode(event.data);
});
