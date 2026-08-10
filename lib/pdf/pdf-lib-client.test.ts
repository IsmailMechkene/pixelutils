import { expect, it } from "vitest";

import { loadPdfLib, mergePdfFiles } from "./pdf-lib-client";

it("loads the PDF engine lazily and can create a local document", async () => {
  const { PDFDocument } = await loadPdfLib();
  const document = await PDFDocument.create();
  document.addPage([100, 100]);

  const bytes = await document.save();

  expect(bytes.byteLength).toBeGreaterThan(0);
});

it("merges PDF page objects without rendering them to an image", async () => {
  const { PDFDocument } = await loadPdfLib();
  const first = await PDFDocument.create();
  first.addPage([100, 100]);
  const second = await PDFDocument.create();
  second.addPage([200, 200]);

  const toArrayBuffer = async (document: typeof first) => {
    const bytes = await document.save();
    return Uint8Array.from(bytes).buffer;
  };

  const bytes = await mergePdfFiles([
    { arrayBuffer: () => toArrayBuffer(first) },
    { arrayBuffer: () => toArrayBuffer(second) },
  ]);
  const merged = await PDFDocument.load(bytes);

  expect(merged.getPageCount()).toBe(2);
  expect(merged.getPage(1).getWidth()).toBe(200);
});
