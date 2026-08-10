import type { PdfFileLike, PdfPageRange } from "./types";

export function isPdfFile(file: Pick<PdfFileLike, "name" | "type">) {
  return (
    file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")
  );
}

export function getPdfOutputFilename(filename: string, suffix: string) {
  const stem = filename.replace(/\.pdf$/i, "") || "document";
  const safeSuffix = suffix.trim().replace(/[^a-z0-9-]+/gi, "-");
  return `${stem}${safeSuffix ? `-${safeSuffix}` : ""}.pdf`;
}

export function validatePdfPageRange(
  range: PdfPageRange,
  pageCount: number,
): string | undefined {
  if (!Number.isInteger(pageCount) || pageCount < 1) {
    return "This PDF does not contain any pages.";
  }
  if (!Number.isInteger(range.start) || !Number.isInteger(range.end)) {
    return "Enter whole page numbers.";
  }
  if (range.start < 1 || range.end < 1 || range.start > range.end) {
    return "The first page must be no greater than the last page.";
  }
  if (range.end > pageCount) {
    return `Choose pages between 1 and ${pageCount}.`;
  }
  return undefined;
}

export function normalizePdfPageOrder(
  pageNumbers: readonly number[],
  pageCount: number,
): number[] | undefined {
  if (
    !Number.isInteger(pageCount) ||
    pageCount < 1 ||
    pageNumbers.length !== pageCount ||
    pageNumbers.some(
      (page) => !Number.isInteger(page) || page < 1 || page > pageCount,
    ) ||
    new Set(pageNumbers).size !== pageCount
  ) {
    return undefined;
  }
  return pageNumbers.map((page) => page - 1);
}
