import type { PDFDocument } from "pdf-lib";

/**
 * Loads the PDF engine only after a client-side PDF tool needs it. Do not call
 * this from Server Components, route metadata, or catalog code.
 */
let pdfLibPromise: Promise<typeof import("pdf-lib")> | undefined;

export function loadPdfLib() {
  pdfLibPromise ??= import("pdf-lib");
  return pdfLibPromise;
}

export async function loadPdfDocument(file: File): Promise<PDFDocument> {
  const { PDFDocument } = await loadPdfLib();
  return PDFDocument.load(await file.arrayBuffer());
}

export async function savePdfDocument(document: PDFDocument) {
  return document.save();
}
