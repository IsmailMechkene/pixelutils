import type { SupportedImageMime } from "./logic";

interface CompressionRequest {
  readonly type: "compress";
  readonly id: number;
  readonly file: File;
  readonly mimeType: SupportedImageMime;
  readonly quality: number;
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

function send(message: CompressionResult | CompressionFailure) {
  postMessage(message);
}

addEventListener("message", async (event: MessageEvent<CompressionRequest>) => {
  const { file, id, mimeType, quality } = event.data;
  if (event.data.type !== "compress") return;

  if (
    typeof OffscreenCanvas === "undefined" ||
    typeof createImageBitmap === "undefined"
  ) {
    send({
      type: "error",
      id,
      message:
        "This browser cannot compress images locally. Try a current browser.",
    });
    return;
  }

  let bitmap: ImageBitmap | undefined;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) throw new Error("The image canvas could not be created.");

    context.drawImage(bitmap, 0, 0);
    const blob = await canvas.convertToBlob({
      type: mimeType,
      quality: mimeType === "image/png" ? undefined : quality / 100,
    });

    if (blob.type !== mimeType) {
      throw new Error(
        "This browser could not create the requested image format.",
      );
    }

    send({ type: "result", id, blob });
  } catch (error) {
    send({
      type: "error",
      id,
      message:
        error instanceof Error
          ? "The image could not be compressed. It may be corrupted or unsupported."
          : "The image could not be compressed.",
    });
  } finally {
    bitmap?.close();
  }
});
