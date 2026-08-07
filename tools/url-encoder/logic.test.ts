import { describe, expect, it } from "vitest";

import { decodeUrl, encodeUrl } from "./logic";

describe("URL encoding", () => {
  it("encodes a query value as a component", () => {
    expect(encodeUrl("coffee & tea/糕", "component")).toEqual({
      ok: true,
      value: "coffee%20%26%20tea%2F%E7%B3%95",
    });
  });

  it("preserves URL structure in full URL mode", () => {
    expect(
      encodeUrl("https://example.com/a path?q=hello world", "full-url"),
    ).toEqual({
      ok: true,
      value: "https://example.com/a%20path?q=hello%20world",
    });
  });

  it("decodes Unicode and reports malformed escapes", () => {
    expect(decodeUrl("caf%C3%A9%20%F0%9F%91%8B", "component")).toEqual({
      ok: true,
      value: "café 👋",
    });
    const invalid = decodeUrl("bad%2", "component");
    expect(invalid.ok).toBe(false);
    if (!invalid.ok)
      expect(invalid.error).toMatch(/^Invalid percent-encoding: /);
  });

  it("rejects empty input", () => {
    expect(encodeUrl("", "component").ok).toBe(false);
    expect(decodeUrl("", "component").ok).toBe(false);
  });
});
