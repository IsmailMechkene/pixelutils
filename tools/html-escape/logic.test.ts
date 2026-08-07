import { describe, expect, it } from "vitest";

import { escapeHtml, unescapeHtml } from "./logic";

describe("HTML entity conversion", () => {
  it("escapes the five characters that are unsafe in HTML text and attributes", () => {
    expect(escapeHtml(`<button title="Tom & Jerry's">Save</button>`)).toEqual({
      ok: true,
      value:
        "&lt;button title=&quot;Tom &amp; Jerry&#39;s&quot;&gt;Save&lt;/button&gt;",
    });
  });

  it("decodes named, decimal, and hexadecimal entities including Unicode", () => {
    expect(
      unescapeHtml("&lt;p&gt;Caf&#233; &#x1F44B; &copy;&lt;/p&gt;"),
    ).toEqual({
      ok: true,
      value: "<p>Café 👋 ©</p>",
    });
  });

  it("does not execute or interpret decoded markup", () => {
    expect(unescapeHtml("&lt;script&gt;alert(1)&lt;/script&gt;")).toEqual({
      ok: true,
      value: "<script>alert(1)</script>",
    });
  });

  it("rejects empty input", () => {
    expect(escapeHtml("").ok).toBe(false);
    expect(unescapeHtml("").ok).toBe(false);
  });
});
