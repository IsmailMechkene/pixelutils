import { expect, it } from "vitest";

import { loadPdfLib } from "./pdf-lib-client";

it("loads the PDF engine lazily and can create a local document", async () => {
  const { PDFDocument } = await loadPdfLib();
  const document = await PDFDocument.create();
  document.addPage([100, 100]);

  const bytes = await document.save();

  expect(bytes.byteLength).toBeGreaterThan(0);
});
