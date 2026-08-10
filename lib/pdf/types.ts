export const pdfAccept = "application/pdf,.pdf";
export const maxPdfFileBytes = 50 * 1024 * 1024;

export interface PdfFileLike {
  readonly name: string;
  readonly size: number;
  readonly type: string;
}

export interface PdfPageRange {
  readonly start: number;
  readonly end: number;
}
