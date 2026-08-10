import { getSupportedImageMime, readImageDimensions, validateImageDimensions } from "@/tools/image-compressor/logic";
import { loadPdfLib } from "@/lib/pdf/pdf-lib-client";

import {
  getImagePdfLayout,
  maxImagesToPdfPixels,
  type PdfImageMargin,
  type PdfImageOrientation,
  type PdfImagePageSize,
} from "./logic";

export interface ImagesToPdfOptions {
  readonly pageSize: PdfImagePageSize;
  readonly orientation: PdfImageOrientation;
  readonly margin: PdfImageMargin;
}

async function webpToPng(file: File) {
  if (!("createImageBitmap" in window)) {
    throw new Error("This browser cannot convert WebP images locally. Try a current browser.");
  }

  const bitmap = await createImageBitmap(file);
  let canvas: HTMLCanvasElement | undefined;
  try {
    const dimensionError =
      bitmap.width * bitmap.height > maxImagesToPdfPixels
        ? "This image is too large to safely process in this browser. Choose an image below 40 megapixels."
        : validateImageDimensions(bitmap.width, bitmap.height);
    if (dimensionError) throw new Error(dimensionError);

    const conversionCanvas = document.createElement("canvas");
    canvas = conversionCanvas;
    conversionCanvas.width = bitmap.width;
    conversionCanvas.height = bitmap.height;
    const context = conversionCanvas.getContext("2d");
    if (!context) throw new Error("This browser could not prepare the WebP image.");
    context.drawImage(bitmap, 0, 0);
    const blob = await new Promise<Blob | undefined>((resolve) =>
      conversionCanvas.toBlob((blob) => resolve(blob ?? undefined), "image/png"),
    );
    if (!blob) throw new Error("This browser could not convert the WebP image.");
    return new Uint8Array(await blob.arrayBuffer());
  } finally {
    bitmap.close();
    if (canvas) {
      canvas.width = 1;
      canvas.height = 1;
    }
  }
}

export async function createPdfFromImages(
  files: readonly File[],
  options: ImagesToPdfOptions,
) {
  const { PDFDocument } = await loadPdfLib();
  const document = await PDFDocument.create();

  for (const file of files) {
    const mimeType = getSupportedImageMime(file);
    if (!mimeType) throw new Error("Choose only PNG, JPG, JPEG, or WebP images.");

    const sourceBytes = new Uint8Array(await file.arrayBuffer());
    const dimensions = readImageDimensions(sourceBytes, mimeType);
    const dimensionError = dimensions
      ? dimensions.width * dimensions.height > maxImagesToPdfPixels
        ? "This image is too large to safely process in this browser. Choose an image below 40 megapixels."
        : validateImageDimensions(dimensions.width, dimensions.height)
      : "This image could not be read.";
    if (dimensionError) throw new Error(dimensionError);

    const image =
      mimeType === "image/jpeg"
        ? await document.embedJpg(sourceBytes)
        : mimeType === "image/png"
          ? await document.embedPng(sourceBytes)
          : await document.embedPng(await webpToPng(file));
    const layout = getImagePdfLayout(
      { width: image.width, height: image.height },
      options.pageSize,
      options.orientation,
      options.margin,
    );
    const page = document.addPage([layout.page.width, layout.page.height]);
    page.drawImage(image, layout.image);
  }

  return document.save();
}
