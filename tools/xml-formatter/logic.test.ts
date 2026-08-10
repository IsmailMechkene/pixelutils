import { describe, expect, it } from "vitest";
import { formatXml } from "./logic";

describe("formatXml", () => {
  it("formats nested XML without changing mixed text", () => {
    expect(formatXml('<root><item id="1">Hello <b>world</b></item></root>')).toEqual({ ok: true, value: '<root>\n  <item id="1">Hello <b>world</b></item>\n</root>' });
  });
  it("rejects malformed markup and multiple roots", () => {
    for (const input of ["<a></b>", '<a value="unterminated></a>', "<a></a><b></b>"]) {
      expect(formatXml(input).ok).toBe(false);
    }
  });
});
