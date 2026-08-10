import { loadPdfRenderer } from "@/lib/pdf/pdf-renderer-client";
import type { PDFDocumentProxy } from "pdfjs-dist";

import { validateRenderPixels, type PdfImageOutputFormat } from "./logic";

export type PdfDocumentHandle = PDFDocumentProxy;

export async function disposePdfDocument(document?: PdfDocumentHandle) {
  if (!document) return;
  await document.loadingTask.destroy();
}

export async function loadPdfForImageRendering(file: File): Promise<PdfDocumentHandle> {
  const pdfjs = await loadPdfRenderer();
  const task = pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) });
  return task.promise;
}

export async function renderPdfPageToImage(
  pdfDocument: PdfDocumentHandle,
  pageNumber: number,
  scale: number,
  format: PdfImageOutputFormat,
  quality: number,
  signal?: AbortSignal,
) {
  const page = await pdfDocument.getPage(pageNumber);
  const viewport = page.getViewport({ scale });
  const validation = validateRenderPixels(viewport.width, viewport.height);
  if (validation) {
    page.cleanup();
    throw new Error(validation);
  }

  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(viewport.width);
  canvas.height = Math.ceil(viewport.height);
  const context = canvas.getContext("2d", { alpha: format === "image/png" });
  if (!context) {
    page.cleanup();
    throw new Error("This browser cannot create an image canvas.");
  }
  if (format === "image/jpeg") {
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  const renderTask = page.render({ canvas, canvasContext: context, viewport });
  const cancel = () => renderTask.cancel();
  signal?.addEventListener("abort", cancel, { once: true });
  try {
    if (signal?.aborted) throw new DOMException("Rendering cancelled.", "AbortError");
    await renderTask.promise;
    const blob = await new Promise<Blob | undefined>((resolve) =>
      canvas.toBlob(
        (image: Blob | null) => resolve(image ?? undefined),
        format,
        format === "image/jpeg" ? quality / 100 : undefined,
      ),
    );
    if (!blob) throw new Error("This browser could not create the image.");
    return { blob, width: canvas.width, height: canvas.height };
  } finally {
    signal?.removeEventListener("abort", cancel);
    page.cleanup();
    canvas.width = 1;
    canvas.height = 1;
  }
}
