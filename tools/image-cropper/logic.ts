export type CropArea = {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
};

export type CropAspectPreset = "free" | "1:1" | "4:3" | "16:9" | "3:2";

export const cropAspectPresets: readonly {
  readonly value: CropAspectPreset;
  readonly label: string;
  readonly aspect?: number;
}[] = [
  { value: "free", label: "Free" },
  { value: "1:1", label: "1:1", aspect: 1 },
  { value: "4:3", label: "4:3", aspect: 4 / 3 },
  { value: "16:9", label: "16:9", aspect: 16 / 9 },
  { value: "3:2", label: "3:2", aspect: 3 / 2 },
];

export function getCropAspect(preset: CropAspectPreset) {
  return cropAspectPresets.find((option) => option.value === preset)?.aspect;
}

export function normalizeCropArea(
  crop: CropArea,
  image: { readonly width: number; readonly height: number },
): CropArea | undefined {
  if (
    !Number.isFinite(crop.x) ||
    !Number.isFinite(crop.y) ||
    !Number.isFinite(crop.width) ||
    !Number.isFinite(crop.height) ||
    crop.width <= 0 ||
    crop.height <= 0 ||
    image.width <= 0 ||
    image.height <= 0
  ) {
    return undefined;
  }

  const x = Math.max(0, Math.min(image.width - 1, Math.floor(crop.x)));
  const y = Math.max(0, Math.min(image.height - 1, Math.floor(crop.y)));
  const width = Math.max(1, Math.min(image.width - x, Math.round(crop.width)));
  const height = Math.max(
    1,
    Math.min(image.height - y, Math.round(crop.height)),
  );

  return { x, y, width, height };
}

export function getCroppedFilename(filename: string, extension: string) {
  const stem = filename.replace(/\.[^.]+$/, "") || "image";
  return `${stem}-cropped.${extension}`;
}
