import { describe, expect, it } from "vitest"; import { formatXml } from "./logic";
describe("formatXml", () => { it("formats nested XML", () => expect(formatXml("<root><item id=\"1\">Hello</item></root>")).toEqual({ ok: true, value: '<root>\n  <item id="1">\n    Hello\n  </item>\n</root>' })); it("rejects mismatched tags", () => expect(formatXml("<a></b>").ok).toBe(false)); });
