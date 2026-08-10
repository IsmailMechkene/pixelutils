import { describe, expect, it } from "vitest";

import {
  getAvailableOutputFormats,
  getConvertedFilename,
  getInitialOutputFormat,
  isPresetCompatible,
} from "./logic";

describe("image converter options", () => {
  it("offers only conversions supported by the native image pipeline", () => {
    expect(getAvailableOutputFormats("image/png")).toEqual([
      "image/jpeg",
      "image/webp",
    ]);
    expect(getAvailableOutputFormats("image/jpeg")).toEqual([
      "image/png",
      "image/webp",
    ]);
  });

  it("uses compatible presets and a filename with the requested extension", () => {
    expect(getInitialOutputFormat("image/png", { output: "image/webp" })).toBe(
      "image/webp",
    );
    expect(isPresetCompatible("image/png", { input: "image/png" })).toBe(true);
    expect(isPresetCompatible("image/webp", { input: "image/png" })).toBe(
      false,
    );
    expect(getConvertedFilename("holiday.photo.jpeg", "image/png")).toBe(
      "holiday.photo.png",
    );
  });
});
