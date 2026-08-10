import { describe, expect, it } from "vitest";
import { csvToJson } from "./logic";
describe("csvToJson", () => {
  it("parses quoted commas and Unicode", () => expect(csvToJson('name,note\nAda,"hello, cafÃ©"')).toEqual({ ok: true, rows: 1, value: '[\n  {\n    "name": "Ada",\n    "note": "hello, cafÃ©"\n  }\n]' }));
  it("reports malformed input", () => { expect(csvToJson("").ok).toBe(false); expect(csvToJson('name\n"Ada').ok).toBe(false); });
});
