import { describe, expect, it } from "vitest";

import { countText } from "./logic";

describe("countText", () => {
  it("counts words reasonably around whitespace and punctuation", () => {
    expect(countText("  Hello, world!\nIt's production-ready.  ")).toEqual({
      words: 4,
      characters: 40,
      charactersWithoutWhitespace: 33,
      lines: 2,
      sentences: 2,
    });
  });

  it("supports Unicode letters and counts emoji as one code point", () => {
    expect(countText("Café 世界 👋")).toEqual({
      words: 2,
      characters: 9,
      charactersWithoutWhitespace: 7,
      lines: 1,
      sentences: 1,
    });
  });

  it("handles empty input and punctuation-only input", () => {
    expect(countText("")).toEqual({
      words: 0,
      characters: 0,
      charactersWithoutWhitespace: 0,
      lines: 0,
      sentences: 0,
    });
    expect(countText("... ---").words).toBe(0);
  });
});
