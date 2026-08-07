import { describe, expect, it } from "vitest";

import { removeDuplicateLines } from "./logic";

const defaults = {
  caseSensitive: true,
  trimForComparison: false,
  removeEmptyLines: false,
} as const;

describe("removeDuplicateLines", () => {
  it("keeps the first occurrence and original order", () => {
    expect(removeDuplicateLines("beta\nalpha\nbeta\ngamma\nalpha", defaults)).toEqual({
      value: "beta\nalpha\ngamma",
      removed: 2,
      kept: 3,
    });
  });

  it("supports case-insensitive comparison", () => {
    expect(
      removeDuplicateLines("Apple\napple\nAPPLE\nPear", {
        ...defaults,
        caseSensitive: false,
      }),
    ).toEqual({ value: "Apple\nPear", removed: 2, kept: 2 });
  });

  it("can compare trimmed lines and remove empty lines", () => {
    expect(
      removeDuplicateLines(" one \none\n  \n\ntwo", {
        caseSensitive: true,
        trimForComparison: true,
        removeEmptyLines: true,
      }),
    ).toEqual({ value: " one \ntwo", removed: 3, kept: 2 });
  });

  it("normalizes line endings and handles empty input", () => {
    expect(removeDuplicateLines("a\r\nb\r\na", defaults).value).toBe("a\nb");
    expect(removeDuplicateLines("", defaults)).toEqual({ value: "", removed: 0, kept: 0 });
  });
});
