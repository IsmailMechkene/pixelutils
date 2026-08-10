export type PdfImageOutputFormat = "image/png" | "image/jpeg";
export type PdfRenderScale = "1" | "1.5" | "2";

export const maxPdfToImagesFileBytes = 50 * 1024 * 1024;
export const maxPdfToImagesPages = 50;
export const maxPdfToImagesPixels = 20_000_000;
export const previewPageLimit = 3;

export function getPdfImageFilename(
  filename: string,
  pageNumber: number,
  format: PdfImageOutputFormat,
) {
  const stem = filename.replace(/\.pdf$/i, "") || "document";
  const extension = format === "image/png" ? "png" : "jpg";
  return `${stem}-page-${pageNumber}.${extension}`;
}

export function validatePdfRenderPlan(
  pageNumbers: readonly number[],
  pageCount: number,
) {
  if (!pageNumbers.length) return "Select at least one page.";
  if (pageNumbers.length > maxPdfToImagesPages) {
    return `Select up to ${maxPdfToImagesPages} pages at once to keep rendering reliable.`;
  }
  if (pageNumbers.some((page) => page < 1 || page > pageCount)) {
    return `Choose pages between 1 and ${pageCount}.`;
  }
  return undefined;
}

export function validateRenderPixels(width: number, height: number) {
  if (!Number.isFinite(width) || !Number.isFinite(height) || width < 1 || height < 1) {
    return "This PDF page has invalid dimensions.";
  }
  if (width * height > maxPdfToImagesPixels) {
    return "This page would create an image larger than 20 megapixels. Choose a lower resolution.";
  }
  return undefined;
}
