import { describe, expect, it } from "vitest";

import {
  getAspectHeight,
  getAspectWidth,
  isUpscaling,
  validateResizeDimensions,
} from "./logic";

describe("image resizer helpers", () => {
  const original = { width: 1_200, height: 800 };

  it("keeps aspect-ratio dimensions rounded to usable whole pixels", () => {
    expect(getAspectHeight(600, original)).toBe(400);
    expect(getAspectWidth(400, original)).toBe(600);
  });

  it("rejects invalid and excessive output dimensions", () => {
    expect(validateResizeDimensions(0, 100)).toMatch(/greater than zero/);
    expect(validateResizeDimensions(8_000, 5_001)).toMatch(/too large/);
    expect(validateResizeDimensions(600, 400)).toBeUndefined();
  });

  it("reports when a user has chosen to upscale", () => {
    expect(isUpscaling({ width: 1_201, height: 800 }, original)).toBe(true);
    expect(isUpscaling({ width: 1_200, height: 800 }, original)).toBe(false);
  });
});
