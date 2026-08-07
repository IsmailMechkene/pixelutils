import { describe, expect, it } from "vitest";

import { formatJson } from "./logic";

describe("formatJson", () => {
  it("formats nested JSON without changing its data", () => {
    const result = formatJson('{"name":"PixelUtils","flags":[true,null]}');

    expect(result).toEqual({
      ok: true,
      value: '{\n  "name": "PixelUtils",\n  "flags": [\n    true,\n    null\n  ]\n}',
    });
  });

  it("accepts valid JSON primitives", () => {
    expect(formatJson("false")).toEqual({ ok: true, value: "false" });
  });

  it("adds context while preserving the native parser detail", () => {
    const result = formatJson('{"name":}');

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/^Invalid JSON: /);
      expect(result.error.length).toBeGreaterThan("Invalid JSON: ".length);
    }
  });

  it("rejects empty input and invalid indentation", () => {
    expect(formatJson("  ")).toEqual({ ok: false, error: "Enter JSON to format." });
    expect(formatJson("{}", 11)).toEqual({
      ok: false,
      error: "Indentation must be a whole number from 0 to 10.",
    });
  });
});
