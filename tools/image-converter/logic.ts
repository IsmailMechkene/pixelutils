import type { SupportedImageMime } from "../image-compressor/logic";

export type ImageConverterPreset = {
  readonly input?: SupportedImageMime;
  readonly output?: SupportedImageMime;
};

const outputFormats: Record<SupportedImageMime, readonly SupportedImageMime[]> =
  {
    "image/png": ["image/jpeg", "image/webp"],
    "image/jpeg": ["image/png", "image/webp"],
    "image/webp": ["image/png", "image/jpeg"],
  };

export const imageFormatLabels: Record<SupportedImageMime, string> = {
  "image/jpeg": "JPG",
  "image/png": "PNG",
  "image/webp": "WebP",
};

export function getAvailableOutputFormats(source: SupportedImageMime) {
  return outputFormats[source];
}

export function getInitialOutputFormat(
  source: SupportedImageMime,
  preset?: ImageConverterPreset,
) {
  const allowed = getAvailableOutputFormats(source);
  return preset?.output && allowed.includes(preset.output)
    ? preset.output
    : allowed[0];
}

export function isPresetCompatible(
  source: SupportedImageMime,
  preset?: ImageConverterPreset,
) {
  return !preset?.input || preset.input === source;
}

export function getConvertedFilename(
  filename: string,
  output: SupportedImageMime,
) {
  const stem = filename.replace(/\.[^.]+$/, "") || "image";
  const extension =
    output === "image/jpeg" ? "jpg" : output.slice("image/".length);
  return `${stem}.${extension}`;
}

export function getOutputFormatDescription(output: SupportedImageMime) {
  return output === "image/jpeg"
    ? "JPG cannot keep transparent pixels. Choose a background color below."
    : output === "image/webp"
      ? "WebP keeps transparency when the source image has it."
      : "PNG keeps transparent pixels when the source image has them.";
}

export type { SupportedImageMime };
