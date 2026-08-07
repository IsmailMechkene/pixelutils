import { describe, expect, it } from "vitest";

import { renderMarkdown } from "./logic";

describe("renderMarkdown", () => {
  it("renders common Markdown structures", async () => {
    const result = await renderMarkdown("# Notes\n\n- **Fast**\n- `private`");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toContain("<h1>Notes</h1>");
      expect(result.value).toContain("<strong>Fast</strong>");
      expect(result.value).toContain("<code>private</code>");
    }
  });

  it("removes scripts, event handlers, images, and unsafe links", async () => {
    const result = await renderMarkdown(
      '<script>alert(1)</script><p onclick="alert(2)">Safe</p>\n\n[bad](javascript:alert(3))\n\n![tracking](https://example.com/pixel.png)',
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).not.toMatch(/script|onclick|javascript:|<img/i);
      expect(result.value).toContain("Safe");
    }
  });

  it("rejects empty input", async () => {
    expect(await renderMarkdown("  ")).toEqual({
      ok: false,
      error: "Enter Markdown to preview.",
    });
  });
});
