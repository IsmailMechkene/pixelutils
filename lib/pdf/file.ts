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

export type PdfPageSelection =
  | { readonly pageNumbers: readonly number[] }
  | { readonly error: string };

/** Parses a page list such as "1-3,6,8-10" using one-based page numbers. */
export function parsePdfPageSelection(
  value: string,
  pageCount: number,
): PdfPageSelection {
  if (!Number.isInteger(pageCount) || pageCount < 1) {
    return { error: "This PDF does not contain any pages." };
  }

  const parts = value.split(",").map((part) => part.trim());
  if (!value.trim() || parts.some((part) => !part)) {
    return { error: "Enter pages such as 1-3, 1,3,5, or 1-3,6,8-10." };
  }

  const pageNumbers: number[] = [];
  for (const part of parts) {
    const rangeMatch = /^(\d+)\s*-\s*(\d+)$/.exec(part);
    const pageMatch = /^(\d+)$/.exec(part);

    if (rangeMatch) {
      const start = Number(rangeMatch[1]);
      const end = Number(rangeMatch[2]);
      const error = validatePdfPageRange({ start, end }, pageCount);
      if (error) return { error };
      for (let page = start; page <= end; page += 1) pageNumbers.push(page);
      continue;
    }

    if (pageMatch) {
      const page = Number(pageMatch[1]);
      if (page < 1 || page > pageCount) {
        return { error: `Choose pages between 1 and ${pageCount}.` };
      }
      pageNumbers.push(page);
      continue;
    }

    return { error: "Enter pages such as 1-3, 1,3,5, or 1-3,6,8-10." };
  }

  if (new Set(pageNumbers).size !== pageNumbers.length) {
    return { error: "Enter each page only once." };
  }

  return { pageNumbers };
}
