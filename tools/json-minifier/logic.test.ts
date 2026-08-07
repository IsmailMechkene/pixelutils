import { describe, expect, it } from "vitest";

import { minifyJson } from "./logic";

describe("minifyJson", () => {
  it("removes insignificant whitespace while preserving data", () => {
    expect(minifyJson('{\n  "items": [1, 2],\n  "active": true\n}')).toEqual({
      ok: true,
      value: '{"items":[1,2],"active":true}',
    });
  });

  it("preserves whitespace inside string values", () => {
    expect(minifyJson('{ "message": "keep  this" }')).toEqual({
      ok: true,
      value: '{"message":"keep  this"}',
    });
  });

  it("rejects empty and malformed input with useful parser detail", () => {
    expect(minifyJson(" ")).toEqual({
      ok: false,
      error: "Enter JSON to minify.",
    });
    const result = minifyJson("{broken}");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/^Invalid JSON: .+/);
  });
});
