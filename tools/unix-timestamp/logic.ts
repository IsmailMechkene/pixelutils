export type TimestampUnit = "seconds" | "milliseconds";
export type TimestampResult =
  | { readonly ok: true; readonly milliseconds: number; readonly iso: string }
  | { readonly ok: false; readonly error: string };

export function timestampToDate(
  input: string,
  unit: TimestampUnit,
): TimestampResult {
  if (!input.trim()) return { ok: false, error: "Enter a Unix timestamp." };
  const value = Number(input);
  if (!Number.isFinite(value) || !Number.isInteger(value)) {
    return {
      ok: false,
      error: "A Unix timestamp must be a finite whole number.",
    };
  }
  const milliseconds = unit === "seconds" ? value * 1000 : value;
  if (!Number.isSafeInteger(milliseconds)) {
    return {
      ok: false,
      error: "This timestamp is outside the supported range.",
    };
  }
  const date = new Date(milliseconds);
  if (Number.isNaN(date.getTime())) {
    return {
      ok: false,
      error: "This timestamp is outside the JavaScript date range.",
    };
  }
  return { ok: true, milliseconds, iso: date.toISOString() };
}

export function dateToTimestamp(date: Date, unit: TimestampUnit) {
  const milliseconds = date.getTime();
  if (Number.isNaN(milliseconds))
    throw new Error("Enter a valid date and time.");
  return unit === "seconds" ? Math.floor(milliseconds / 1000) : milliseconds;
}
