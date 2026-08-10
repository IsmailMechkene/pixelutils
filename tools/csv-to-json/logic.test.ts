import { describe, expect, it } from "vitest";
import { csvToJson } from "./logic";
describe("csvToJson", () => {
  it("parses quoted commas and Unicode", () => expect(csvToJson('name,note\nAda,"hello, cafÃ©"')).toEqual({ ok: true, rows: 1, value: '[\n  {\n    "name": "Ada",\n    "note": "hello, cafÃ©"\n  }\n]' }));
  it("rejects malformed quotes and unequal rows instead of changing source data", () => {
    expect(csvToJson("").ok).toBe(false);
    expect(csvToJson('name\n"Ada').ok).toBe(false);
    expect(csvToJson('name,role\nAda,Engineer,extra').ok).toBe(false);
    expect(csvToJson('name\nAda"').ok).toBe(false);
  });
});
