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

export async function mergePdfFiles(
  files: readonly Pick<File, "arrayBuffer">[],
) {
  const { PDFDocument } = await loadPdfLib();
  const merged = await PDFDocument.create();

  for (const file of files) {
    const source = await PDFDocument.load(await file.arrayBuffer());
    const pages = await merged.copyPages(source, source.getPageIndices());
    for (const page of pages) merged.addPage(page);
  }

  return merged.save();
}
