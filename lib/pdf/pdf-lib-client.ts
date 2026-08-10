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

export async function extractPdfPages(
  file: Pick<File, "arrayBuffer">,
  pageNumbers: readonly number[],
) {
  const { PDFDocument } = await loadPdfLib();
  const source = await PDFDocument.load(await file.arrayBuffer());
  const extracted = await PDFDocument.create();
  const pages = await extracted.copyPages(
    source,
    pageNumbers.map((page) => page - 1),
  );
  for (const page of pages) extracted.addPage(page);
  return extracted.save();
}

export async function splitPdfIntoPages(file: Pick<File, "arrayBuffer">) {
  const { PDFDocument } = await loadPdfLib();
  const source = await PDFDocument.load(await file.arrayBuffer());
  const outputs = [];

  for (const sourcePageIndex of source.getPageIndices()) {
    const document = await PDFDocument.create();
    const [page] = await document.copyPages(source, [sourcePageIndex]);
    document.addPage(page);
    outputs.push(await document.save());
  }

  return outputs;
}
