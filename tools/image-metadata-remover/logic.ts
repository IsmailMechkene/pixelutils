import type { SupportedImageMime } from "../image-compressor/logic";

export function getMetadataRemovedFilename(
  filename: string,
  mimeType: SupportedImageMime,
) {
  const stem = filename.replace(/\.[^.]+$/, "") || "image";
  const extension =
    mimeType === "image/jpeg" ? "jpg" : mimeType.slice("image/".length);
  return `${stem}-sanitized.${extension}`;
}
