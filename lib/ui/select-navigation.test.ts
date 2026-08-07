import { describe, expect, it } from "vitest";

import {
  findSelectOptionByPrefix,
  getNextSelectIndex,
} from "./select-navigation";

describe("getNextSelectIndex", () => {
  it("wraps arrow navigation and supports boundaries", () => {
    expect(getNextSelectIndex(2, 3, "ArrowDown")).toBe(0);
    expect(getNextSelectIndex(0, 3, "ArrowUp")).toBe(2);
    expect(getNextSelectIndex(1, 3, "Home")).toBe(0);
    expect(getNextSelectIndex(1, 3, "End")).toBe(2);
  });

  it("handles empty and unselected lists", () => {
    expect(getNextSelectIndex(0, 0, "ArrowDown")).toBe(-1);
    expect(getNextSelectIndex(-1, 3, "ArrowDown")).toBe(0);
    expect(getNextSelectIndex(-1, 3, "ArrowUp")).toBe(2);
  });
});

describe("findSelectOptionByPrefix", () => {
  const labels = ["Paragraphs", "Sentences", "Words"];

  it("matches case-insensitively and searches after the current option", () => {
    expect(findSelectOptionByPrefix(labels, "s", 0)).toBe(1);
    expect(findSelectOptionByPrefix(labels, "P", 2)).toBe(0);
  });

  it("returns -1 for empty and unmatched queries", () => {
    expect(findSelectOptionByPrefix(labels, "", 0)).toBe(-1);
    expect(findSelectOptionByPrefix(labels, "x", 0)).toBe(-1);
  });
});
