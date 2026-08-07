import { describe, expect, it } from "vitest";

import { dateToTimestamp, timestampToDate } from "./logic";

describe("Unix timestamp conversion", () => {
  it("distinguishes seconds from milliseconds explicitly", () => {
    expect(timestampToDate("1704067200", "seconds")).toEqual({
      ok: true,
      milliseconds: 1_704_067_200_000,
      iso: "2024-01-01T00:00:00.000Z",
    });
    expect(timestampToDate("1704067200", "milliseconds")).toEqual({
      ok: true,
      milliseconds: 1_704_067_200,
      iso: "1970-01-20T17:21:07.200Z",
    });
  });

  it("supports dates before the Unix epoch", () => {
    expect(timestampToDate("-1", "seconds")).toEqual({
      ok: true,
      milliseconds: -1000,
      iso: "1969-12-31T23:59:59.000Z",
    });
  });

  it("converts a Date to either unit", () => {
    const date = new Date("2024-01-01T00:00:00.987Z");
    expect(dateToTimestamp(date, "seconds")).toBe(1_704_067_200);
    expect(dateToTimestamp(date, "milliseconds")).toBe(1_704_067_200_987);
  });

  it("rejects ambiguous decimals and invalid dates", () => {
    expect(timestampToDate("1.5", "seconds").ok).toBe(false);
    expect(timestampToDate("nope", "seconds").ok).toBe(false);
    expect(() => dateToTimestamp(new Date("invalid"), "seconds")).toThrow(/valid date/);
  });
});
