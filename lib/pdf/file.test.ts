import { describe, expect, it } from "vitest";

import {
  getPdfOutputFilename,
  isPdfFile,
  normalizePdfPageOrder,
  parsePdfPageSelection,
  validatePdfPageRange,
} from "./file";

describe("PDF file helpers", () => {
  it("accepts PDF MIME types and extensions", () => {
    expect(isPdfFile({ name: "report.pdf", type: "application/pdf" })).toBe(
      true,
    );
    expect(isPdfFile({ name: "REPORT.PDF", type: "" })).toBe(true);
    expect(isPdfFile({ name: "report.txt", type: "text/plain" })).toBe(false);
  });

  it("creates safe PDF output names", () => {
    expect(getPdfOutputFilename("report.final.PDF", "merged files")).toBe(
      "report.final-merged-files.pdf",
    );
    expect(getPdfOutputFilename(".pdf", "")).toBe("document.pdf");
  });

  it("validates ranges and converts a valid page order to zero-based indices", () => {
    expect(validatePdfPageRange({ start: 2, end: 4 }, 3)).toBe(
      "Choose pages between 1 and 3.",
    );
    expect(validatePdfPageRange({ start: 1, end: 3 }, 3)).toBeUndefined();
    expect(normalizePdfPageOrder([3, 1, 2], 3)).toEqual([2, 0, 1]);
    expect(normalizePdfPageOrder([1, 1], 2)).toBeUndefined();
  });

  it("expands mixed page numbers and ranges", () => {
    expect(parsePdfPageSelection("1-3,6,8-10", 10)).toEqual({
      pageNumbers: [1, 2, 3, 6, 8, 9, 10],
    });
  });

  it("rejects pages outside the document and duplicate pages", () => {
    expect(parsePdfPageSelection("1,6", 5)).toEqual({
      error: "Choose pages between 1 and 5.",
    });
    expect(parsePdfPageSelection("1-3,3", 5)).toEqual({
      error: "Enter each page only once.",
    });
  });
});
