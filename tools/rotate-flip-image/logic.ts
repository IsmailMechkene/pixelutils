export interface ImageDimensions {
  readonly width: number;
  readonly height: number;
}

export type Rotation = 0 | 90 | 180 | 270;

export function getRotatedDimensions(
  dimensions: ImageDimensions,
  rotation: Rotation,
): ImageDimensions {
  return rotation === 90 || rotation === 270
    ? { width: dimensions.height, height: dimensions.width }
    : dimensions;
}

export function hasImageTransform(
  rotation: Rotation,
  flipHorizontal: boolean,
  flipVertical: boolean,
) {
  return rotation !== 0 || flipHorizontal || flipVertical;
}

export function getRotatedFilename(filename: string, extension: string) {
  const stem = filename.replace(/\.[^.]+$/, "") || "image";
  return `${stem}-rotated.${extension}`;
}
