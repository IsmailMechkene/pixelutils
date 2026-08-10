import { describe, expect, it } from "vitest";

import {
  getAvailableOutputFormats,
  getConvertedFilename,
  getInitialOutputFormat,
  getImageConverterPreset,
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

  it("provides fixed source and output presets for dedicated routes", () => {
    expect(getImageConverterPreset("png-to-jpg")).toEqual({
      input: "image/png",
      output: "image/jpeg",
    });
    expect(getImageConverterPreset("webp-to-png")).toEqual({
      input: "image/webp",
      output: "image/png",
    });
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
