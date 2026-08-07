import { describe, expect, it } from "vitest";

import { generateLorem } from "./logic";

const cycle = (() => {
  let index = -1;
  return (maximum: number) => {
    index = (index + 1) % maximum;
    return index;
  };
})();

describe("generateLorem", () => {
  it("generates the exact requested word count", () => {
    const result = generateLorem(
      { unit: "words", count: 12, startWithLorem: false },
      cycle,
    );
    expect(result.split(" ")).toHaveLength(12);
  });

  it("uses the classic opening without changing a short word count", () => {
    expect(
      generateLorem({ unit: "words", count: 3, startWithLorem: true }, cycle),
    ).toBe("Lorem ipsum dolor");
  });

  it("separates paragraphs and produces complete sentences", () => {
    const result = generateLorem(
      { unit: "paragraphs", count: 2, startWithLorem: true },
      cycle,
    );
    expect(result.split("\n\n")).toHaveLength(2);
    expect(result).toMatch(/^Lorem ipsum dolor sit amet,/);
    expect(result.endsWith(".")).toBe(true);
  });

  it("validates unit-specific limits and the random source", () => {
    expect(() =>
      generateLorem(
        { unit: "paragraphs", count: 21, startWithLorem: false },
        cycle,
      ),
    ).toThrow(/1 to 20/);
    expect(() =>
      generateLorem(
        { unit: "words", count: 1, startWithLorem: false },
        () => -1,
      ),
    ).toThrow(/invalid word index/);
  });
});
