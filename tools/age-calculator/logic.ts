interface DateParts {
  readonly year: number;
  readonly month: number;
  readonly day: number;
}

export type AgeResult =
  | {
      readonly ok: true;
      readonly years: number;
      readonly months: number;
      readonly days: number;
      readonly totalDays: number;
    }
  | { readonly ok: false; readonly error: string };

function isLeapYear(year: number) {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

function daysInMonth(year: number, month: number) {
  return (
    [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][
      month - 1
    ] ?? 0
  );
}

function parseDateOnly(input: string): DateParts | undefined {
  const match = input.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return undefined;
  const year = Number(match[1]),
    month = Number(match[2]),
    day = Number(match[3]);
  if (
    year < 1 ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > daysInMonth(year, month)
  )
    return undefined;
  return { year, month, day };
}

function timestamp(date: DateParts) {
  const value = new Date(0);
  value.setUTCHours(0, 0, 0, 0);
  value.setUTCFullYear(date.year, date.month - 1, date.day);
  return value.getTime();
}
function compare(left: DateParts, right: DateParts) {
  return Math.sign(timestamp(left) - timestamp(right));
}

function addYearsClamped(date: DateParts, years: number): DateParts {
  const year = date.year + years;
  return {
    year,
    month: date.month,
    day: Math.min(date.day, daysInMonth(year, date.month)),
  };
}

function addMonthClamped(date: DateParts): DateParts {
  const month = date.month === 12 ? 1 : date.month + 1;
  const year = date.month === 12 ? date.year + 1 : date.year;
  return { year, month, day: Math.min(date.day, daysInMonth(year, month)) };
}

export function calculateAge(birthInput: string, asOfInput: string): AgeResult {
  const birth = parseDateOnly(birthInput);
  const asOf = parseDateOnly(asOfInput);
  if (!birth)
    return {
      ok: false,
      error: "Enter a valid birth date in YYYY-MM-DD format.",
    };
  if (!asOf)
    return {
      ok: false,
      error: "Enter a valid comparison date in YYYY-MM-DD format.",
    };
  if (compare(birth, asOf) > 0)
    return { ok: false, error: "Birth date cannot be in the future." };

  let years = asOf.year - birth.year;
  if (compare(addYearsClamped(birth, years), asOf) > 0) years -= 1;
  let cursor = addYearsClamped(birth, years);
  let months = 0;
  while (months < 11) {
    const next = addMonthClamped(cursor);
    if (compare(next, asOf) > 0) break;
    cursor = next;
    months += 1;
  }
  const days = Math.round((timestamp(asOf) - timestamp(cursor)) / 86_400_000);
  const totalDays = Math.round(
    (timestamp(asOf) - timestamp(birth)) / 86_400_000,
  );
  return { ok: true, years, months, days, totalDays };
}
