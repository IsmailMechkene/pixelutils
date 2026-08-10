export interface ResizeDimensions {
  readonly width: number;
  readonly height: number;
}

export function getAspectHeight(width: number, original: ResizeDimensions) {
  return Math.max(1, Math.round((width * original.height) / original.width));
}

export function getAspectWidth(height: number, original: ResizeDimensions) {
  return Math.max(1, Math.round((height * original.width) / original.height));
}

export function validateResizeDimensions(
  width: number,
  height: number,
  maxPixels = 40_000_000,
): string | undefined {
  if (
    !Number.isInteger(width) ||
    !Number.isInteger(height) ||
    width < 1 ||
    height < 1
  ) {
    return "Enter whole-number width and height values greater than zero.";
  }
  if (width * height > maxPixels) {
    return "The resized image would be too large to safely process in this browser.";
  }
  return undefined;
}

export function isUpscaling(
  target: ResizeDimensions,
  original: ResizeDimensions,
) {
  return target.width > original.width || target.height > original.height;
}
