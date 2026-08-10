const supportedImageMimes = ["image/jpeg", "image/png", "image/webp"] as const;

export type SupportedImageMime = (typeof supportedImageMimes)[number];

const extensionMimes: Record<string, SupportedImageMime> = {
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

export const imageCompressorAccept =
  "image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp";

export const maxImageCompressorBytes = 25 * 1024 * 1024;
export const maxImageCompressorPixels = 40_000_000;

export function getSupportedImageMime(
  file: Pick<File, "name" | "type">,
): SupportedImageMime | undefined {
  if (supportedImageMimes.includes(file.type as SupportedImageMime)) {
    return file.type as SupportedImageMime;
  }

  const extension = file.name.split(".").pop()?.toLowerCase();
  return extension ? extensionMimes[extension] : undefined;
}

export function validateImageDimensions(
  width: number,
  height: number,
): string | undefined {
  if (
    !Number.isInteger(width) ||
    !Number.isInteger(height) ||
    width < 1 ||
    height < 1
  ) {
    return "This image could not be read.";
  }
  if (width * height > maxImageCompressorPixels) {
    return "This image is too large to safely compress in this browser. Choose an image below 40 megapixels.";
  }
  return undefined;
}

export function getCompressedFilename(
  filename: string,
  mimeType: SupportedImageMime,
): string {
  const stem = filename.replace(/\.[^.]+$/, "") || "image";
  const extension =
    mimeType === "image/jpeg" ? "jpg" : mimeType.slice("image/".length);
  return `${stem}-compressed.${extension}`;
}

export function getSizeChange(originalBytes: number, resultBytes: number) {
  if (originalBytes <= 0 || resultBytes < 0) return undefined;
  const percent = ((originalBytes - resultBytes) / originalBytes) * 100;
  return {
    percent,
    label:
      percent >= 0
        ? `${Math.round(percent)}% smaller`
        : `${Math.round(Math.abs(percent))}% larger`,
  };
}
