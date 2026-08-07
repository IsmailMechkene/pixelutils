import { describe, expect, it } from "vitest";

import { validateQrOptions } from "./logic";

const valid = {
  text: "https://pixelutils.example/tools",
  size: 320,
  margin: 4,
  errorLevel: "M",
  darkColor: "#111111",
  lightColor: "#ffffff",
} as const;

describe("validateQrOptions", () => {
  it("accepts practical local QR settings", () => {
    expect(validateQrOptions(valid)).toBe(valid);
  });

  it("rejects empty or excessive content", () => {
    expect(() => validateQrOptions({ ...valid, text: " " })).toThrow(/Enter text/);
    expect(() => validateQrOptions({ ...valid, text: "a".repeat(2001) })).toThrow(/2,000/);
  });

  it("enforces image, margin, correction, and color limits", () => {
    expect(() => validateQrOptions({ ...valid, size: 64 })).toThrow(/128 to 1024/);
    expect(() => validateQrOptions({ ...valid, margin: 11 })).toThrow(/0 to 10/);
    expect(() => validateQrOptions({ ...valid, errorLevel: "X" as "M" })).toThrow(/error-correction/);
    expect(() => validateQrOptions({ ...valid, darkColor: "black" })).toThrow(/six-digit hex/);
    expect(() => validateQrOptions({ ...valid, darkColor: "#ffffff" })).toThrow(/must be different/);
  });
});
