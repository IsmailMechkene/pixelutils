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
export const imageHeaderReadBytes = 512 * 1024;

export interface ImageDimensions {
  readonly width: number;
  readonly height: number;
}

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

function readUint24LittleEndian(bytes: Uint8Array, offset: number) {
  return bytes[offset] | (bytes[offset + 1] << 8) | (bytes[offset + 2] << 16);
}

function readPngDimensions(bytes: Uint8Array): ImageDimensions | undefined {
  if (
    bytes.length < 24 ||
    bytes[0] !== 0x89 ||
    bytes[1] !== 0x50 ||
    bytes[2] !== 0x4e ||
    bytes[3] !== 0x47 ||
    bytes[12] !== 0x49 ||
    bytes[13] !== 0x48 ||
    bytes[14] !== 0x44 ||
    bytes[15] !== 0x52
  ) {
    return undefined;
  }

  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  return { width: view.getUint32(16), height: view.getUint32(20) };
}

function readJpegDimensions(bytes: Uint8Array): ImageDimensions | undefined {
  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8)
    return undefined;

  const startOfFrameMarkers = new Set([
    0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce,
    0xcf,
  ]);
  let offset = 2;
  while (offset + 8 < bytes.length) {
    if (bytes[offset] !== 0xff) return undefined;
    while (bytes[offset] === 0xff) offset += 1;
    const marker = bytes[offset];
    offset += 1;
    if (marker === 0xd8 || marker === 0xd9) continue;
    if (offset + 2 > bytes.length) return undefined;

    const segmentLength = (bytes[offset] << 8) | bytes[offset + 1];
    if (segmentLength < 2 || offset + segmentLength > bytes.length)
      return undefined;
    if (startOfFrameMarkers.has(marker)) {
      return {
        height: (bytes[offset + 3] << 8) | bytes[offset + 4],
        width: (bytes[offset + 5] << 8) | bytes[offset + 6],
      };
    }
    offset += segmentLength;
  }

  return undefined;
}

function readWebpDimensions(bytes: Uint8Array): ImageDimensions | undefined {
  if (
    bytes.length < 30 ||
    String.fromCharCode(...bytes.slice(0, 4)) !== "RIFF" ||
    String.fromCharCode(...bytes.slice(8, 12)) !== "WEBP"
  ) {
    return undefined;
  }

  const chunkType = String.fromCharCode(...bytes.slice(12, 16));
  if (chunkType === "VP8X") {
    return {
      width: readUint24LittleEndian(bytes, 24) + 1,
      height: readUint24LittleEndian(bytes, 27) + 1,
    };
  }
  if (
    chunkType === "VP8 " &&
    bytes[23] === 0x9d &&
    bytes[24] === 0x01 &&
    bytes[25] === 0x2a
  ) {
    return {
      width: (bytes[26] | (bytes[27] << 8)) & 0x3fff,
      height: (bytes[28] | (bytes[29] << 8)) & 0x3fff,
    };
  }
  if (chunkType === "VP8L" && bytes.length >= 25 && bytes[20] === 0x2f) {
    return {
      width: 1 + (bytes[21] | ((bytes[22] & 0x3f) << 8)),
      height:
        1 + ((bytes[22] >> 6) | (bytes[23] << 2) | ((bytes[24] & 0x0f) << 10)),
    };
  }
  return undefined;
}

export function readImageDimensions(
  bytes: Uint8Array,
  mimeType: SupportedImageMime,
): ImageDimensions | undefined {
  if (mimeType === "image/png") return readPngDimensions(bytes);
  if (mimeType === "image/jpeg") return readJpegDimensions(bytes);
  return readWebpDimensions(bytes);
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
