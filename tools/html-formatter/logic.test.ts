import { describe, expect, it } from "vitest";

import { formatHtml } from "./logic";

describe("formatHtml", () => {
  it("formats nested markup with two-space indentation", async () => {
    const result = await formatHtml(
      "<main><h1>Hello</h1><p>Private tools</p></main>",
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toBe(
        "<main>\n  <h1>Hello</h1>\n  <p>Private tools</p>\n</main>",
      );
    }
  });

  it("preserves meaningful inline whitespace", async () => {
    const result = await formatHtml(
      "<p>Hello <strong>careful</strong> world.</p>",
    );
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.value).toContain("Hello <strong>careful</strong> world.");
  });

  it("returns useful errors for empty and malformed markup", async () => {
    expect(await formatHtml(" ")).toEqual({
      ok: false,
      error: "Enter HTML to format.",
    });
    const result = await formatHtml("<div><span></div>");
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error).toMatch(/^Could not format this HTML: /);
  });
});
