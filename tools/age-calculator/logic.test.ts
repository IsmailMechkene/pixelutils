import { describe, expect, it } from "vitest";

import { calculateAge } from "./logic";

describe("calculateAge", () => {
  it("calculates completed years, months, days, and total days", () => {
    expect(calculateAge("1990-05-20", "2026-08-07")).toEqual({
      ok: true,
      years: 36,
      months: 2,
      days: 18,
      totalDays: 13_228,
    });
  });

  it("handles leap-day birthdays using February 28 in non-leap years", () => {
    expect(calculateAge("2000-02-29", "2025-02-27")).toMatchObject({
      ok: true,
      years: 24,
      months: 11,
      days: 29,
    });
    expect(calculateAge("2000-02-29", "2025-02-28")).toMatchObject({
      ok: true,
      years: 25,
      months: 0,
      days: 0,
    });
    expect(calculateAge("2000-02-29", "2024-02-29")).toMatchObject({
      ok: true,
      years: 24,
      months: 0,
      days: 0,
    });
  });

  it("rejects future birth dates and impossible calendar dates", () => {
    expect(calculateAge("2030-01-01", "2026-01-01")).toEqual({
      ok: false,
      error: "Birth date cannot be in the future.",
    });
    expect(calculateAge("2023-02-29", "2026-01-01").ok).toBe(false);
    expect(calculateAge("2000-01-01", "2026-13-01").ok).toBe(false);
  });

  it("is timezone-independent because inputs are date-only", () => {
    expect(calculateAge("2024-12-31", "2025-01-01")).toEqual({
      ok: true,
      years: 0,
      months: 0,
      days: 1,
      totalDays: 1,
    });
  });

  it("applies Gregorian century leap-year rules", () => {
    expect(calculateAge("1900-02-28", "1901-02-28")).toMatchObject({
      ok: true,
      years: 1,
    });
    expect(calculateAge("2000-02-29", "2001-02-28")).toMatchObject({
      ok: true,
      years: 1,
    });
  });

  it("handles four-digit years below 100 without JavaScript's 1900 offset", () => {
    expect(calculateAge("0099-12-31", "0100-12-31")).toMatchObject({
      ok: true,
      years: 1,
      months: 0,
      days: 0,
      totalDays: 365,
    });
  });
});
