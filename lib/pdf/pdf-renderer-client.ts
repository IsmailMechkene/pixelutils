import type * as PdfJs from "pdfjs-dist";

let rendererPromise: Promise<typeof import("pdfjs-dist")> | undefined;

/**
 * Loads PDF.js only after a client-side rendering tool is used. The worker URL
 * is emitted by Next as a same-origin asset, which keeps document contents
 * entirely in the browser.
 */
export function loadPdfRenderer(): Promise<typeof PdfJs> {
  rendererPromise ??= import("pdfjs-dist").then((pdfjs) => {
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/build/pdf.worker.mjs",
      import.meta.url,
    ).toString();
    return pdfjs;
  });
  return rendererPromise;
}
