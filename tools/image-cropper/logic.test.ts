import { describe, expect, it } from "vitest";

import {
  getCropAspect,
  getCroppedFilename,
  normalizeCropArea,
} from "./logic";

describe("image cropper logic", () => {
  it("normalizes a crop within image bounds", () => {
    expect(
      normalizeCropArea(
        { x: -10.2, y: 8.7, width: 120.4, height: 70.6 },
        { width: 100, height: 50 },
      ),
    ).toEqual({ x: 0, y: 8, width: 100, height: 42 });
  });

  it("rejects invalid crop areas", () => {
    expect(
      normalizeCropArea(
        { x: 0, y: 0, width: 0, height: 10 },
        { width: 100, height: 50 },
      ),
    ).toBeUndefined();
  });

  it("provides aspect ratios and safe download names", () => {
    expect(getCropAspect("16:9")).toBeCloseTo(16 / 9);
    expect(getCropAspect("free")).toBeUndefined();
    expect(getCroppedFilename("logo.final.PNG", "png")).toBe(
      "logo.final-cropped.png",
    );
  });
});
