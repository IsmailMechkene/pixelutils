import { expect, it } from "vitest";

import {
  extractPdfPages,
  loadPdfLib,
  mergePdfFiles,
  splitPdfIntoPages,
} from "./pdf-lib-client";

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

it("extracts selected pages and splits page objects without rendering", async () => {
  const { PDFDocument } = await loadPdfLib();
  const source = await PDFDocument.create();
  source.addPage([100, 100]);
  source.addPage([200, 200]);
  source.addPage([300, 300]);
  const sourceBytes = await source.save();
  const file = { arrayBuffer: async () => Uint8Array.from(sourceBytes).buffer };

  const extracted = await PDFDocument.load(await extractPdfPages(file, [1, 3]));
  expect(extracted.getPageCount()).toBe(2);
  expect(extracted.getPage(1).getWidth()).toBe(300);

  const split = await splitPdfIntoPages(file);
  expect(split).toHaveLength(3);
  expect((await PDFDocument.load(split[1])).getPage(0).getWidth()).toBe(200);
});
