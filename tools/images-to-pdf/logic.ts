export type PdfImagePageSize = "auto" | "a4" | "letter";
export type PdfImageOrientation = "auto" | "portrait" | "landscape";
export type PdfImageMargin = "none" | "small" | "normal";

interface PageDimensions {
  readonly width: number;
  readonly height: number;
}

export interface ImagePdfLayout {
  readonly page: PageDimensions;
  readonly image: { readonly x: number; readonly y: number; readonly width: number; readonly height: number };
}

export const imageToPdfAccept =
  "image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp";
export const maxImagesToPdfFileBytes = 25 * 1024 * 1024;
export const maxImagesToPdfCount = 30;
export const maxImagesToPdfTotalBytes = 100 * 1024 * 1024;
export const maxImagesToPdfPixels = 40_000_000;

const sizes: Record<Exclude<PdfImagePageSize, "auto">, PageDimensions> = {
  a4: { width: 595.28, height: 841.89 },
  letter: { width: 612, height: 792 },
};

const margins: Record<PdfImageMargin, number> = {
  none: 0,
  small: 18,
  normal: 36,
};

export function validateImageCollection(files: readonly Pick<File, "size">[]) {
  if (files.length > maxImagesToPdfCount) {
    return `Choose up to ${maxImagesToPdfCount} images at once.`;
  }
  const totalBytes = files.reduce((total, file) => total + file.size, 0);
  if (totalBytes > maxImagesToPdfTotalBytes) {
    return "Choose images totalling 100 MB or less to keep processing reliable on mobile devices.";
  }
  return undefined;
}

export function getImagePdfLayout(
  image: PageDimensions,
  pageSize: PdfImagePageSize,
  orientation: PdfImageOrientation,
  margin: PdfImageMargin,
): ImagePdfLayout {
  const inset = margins[margin];
  if (pageSize === "auto") {
    return {
      page: { width: image.width + inset * 2, height: image.height + inset * 2 },
      image: { x: inset, y: inset, width: image.width, height: image.height },
    };
  }

  const source = sizes[pageSize];
  const landscape =
    orientation === "landscape" ||
    (orientation === "auto" && image.width > image.height);
  const page = landscape
    ? { width: source.height, height: source.width }
    : source;
  const availableWidth = Math.max(1, page.width - inset * 2);
  const availableHeight = Math.max(1, page.height - inset * 2);
  const scale = Math.min(availableWidth / image.width, availableHeight / image.height);
  const width = image.width * scale;
  const height = image.height * scale;

  return {
    page,
    image: {
      x: (page.width - width) / 2,
      y: (page.height - height) / 2,
      width,
      height,
    },
  };
}
