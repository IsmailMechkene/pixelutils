import { describe, expect, it } from "vitest";

import { calculatePercentage } from "./logic";

describe("calculatePercentage", () => {
  it("calculates a percentage of a value", () => {
    expect(calculatePercentage("percent-of", 15, 240)).toEqual({
      ok: true,
      value: 36,
      summary: "15% of 240 is 36.",
    });
  });

  it("calculates what percentage one value is of another", () => {
    expect(calculatePercentage("what-percent", 30, 120)).toMatchObject({ ok: true, value: 25 });
    expect(calculatePercentage("what-percent", 1, 0)).toEqual({ ok: false, error: "The total cannot be zero." });
  });

  it("calculates increases, decreases, and no change", () => {
    expect(calculatePercentage("change", 80, 100)).toMatchObject({ ok: true, value: 25 });
    expect(calculatePercentage("change", 100, 80)).toMatchObject({ ok: true, value: -20 });
    expect(calculatePercentage("change", 50, 50)).toMatchObject({ ok: true, value: 0 });
    expect(calculatePercentage("change", 0, 10).ok).toBe(false);
  });

  it("rejects non-finite numbers", () => {
    expect(calculatePercentage("percent-of", Number.NaN, 1).ok).toBe(false);
    expect(calculatePercentage("percent-of", 1, Number.POSITIVE_INFINITY).ok).toBe(false);
  });
});
