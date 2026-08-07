import { describe, expect, it } from "vitest";

import { hexToHsl, hslToHex, normalizeHexColorInput } from "./color-input";

describe("normalizeHexColorInput", () => {
  it("normalizes six-digit colors with or without a hash", () => {
    expect(normalizeHexColorInput("#a1b2c3")).toBe("#A1B2C3");
    expect(normalizeHexColorInput(" A1B2C3 ")).toBe("#A1B2C3");
  });

  it("expands three-digit shorthand colors", () => {
    expect(normalizeHexColorInput("#abc")).toBe("#AABBCC");
    expect(normalizeHexColorInput("09f")).toBe("#0099FF");
  });

  it("rejects invalid colors and alpha channels", () => {
    expect(normalizeHexColorInput("#12zz56")).toBeUndefined();
    expect(normalizeHexColorInput("#11223344")).toBeUndefined();
    expect(normalizeHexColorInput("")).toBeUndefined();
  });
});

describe("HEX and HSL conversion", () => {
  it("converts primary colors in both directions", () => {
    expect(hexToHsl("#FF0000")).toEqual({
      hue: 0,
      saturation: 100,
      lightness: 50,
    });
    expect(hslToHex({ hue: 120, saturation: 100, lightness: 50 })).toBe(
      "#00FF00",
    );
    expect(hslToHex({ hue: 240, saturation: 100, lightness: 50 })).toBe(
      "#0000FF",
    );
  });

  it("handles neutral colors and clamps percentages", () => {
    expect(hexToHsl("#808080")).toEqual({
      hue: 0,
      saturation: 0,
      lightness: 50,
    });
    expect(hslToHex({ hue: 0, saturation: -10, lightness: 120 })).toBe(
      "#FFFFFF",
    );
  });

  it("rejects invalid HEX input", () => {
    expect(() => hexToHsl("not-a-color")).toThrow(
      "A valid HEX color is required.",
    );
  });
});
