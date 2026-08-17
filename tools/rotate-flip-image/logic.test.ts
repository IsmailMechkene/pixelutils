import { describe, expect, it } from "vitest";

import {
  getRotatedDimensions,
  getRotatedFilename,
  hasImageTransform,
} from "./logic";

describe("rotate and flip image helpers", () => {
  it("swaps dimensions only for quarter turns", () => {
    expect(getRotatedDimensions({ width: 1600, height: 900 }, 90)).toEqual({
      width: 900,
      height: 1600,
    });
    expect(getRotatedDimensions({ width: 1600, height: 900 }, 180)).toEqual({
      width: 1600,
      height: 900,
    });
  });

  it("requires a rotation or flip before processing", () => {
    expect(hasImageTransform(0, false, false)).toBe(false);
    expect(hasImageTransform(0, true, false)).toBe(true);
    expect(hasImageTransform(270, false, false)).toBe(true);
  });

  it("creates a safe output filename", () => {
    expect(getRotatedFilename("holiday.photo.png", "webp")).toBe(
      "holiday.photo-rotated.webp",
    );
    expect(getRotatedFilename(".png", "jpg")).toBe("image-rotated.jpg");
  });
});
