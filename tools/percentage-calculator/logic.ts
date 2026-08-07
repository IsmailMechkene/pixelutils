export const percentageModes = [
  "percent-of",
  "what-percent",
  "change",
] as const;
export type PercentageMode = (typeof percentageModes)[number];

export type PercentageResult =
  | { readonly ok: true; readonly value: number; readonly summary: string }
  | { readonly ok: false; readonly error: string };

function display(value: number) {
  return Number(value.toFixed(8)).toLocaleString("en-US", {
    maximumFractionDigits: 8,
  });
}

export function calculatePercentage(
  mode: PercentageMode,
  first: number,
  second: number,
): PercentageResult {
  if (!Number.isFinite(first) || !Number.isFinite(second)) {
    return { ok: false, error: "Enter two finite numbers." };
  }

  if (mode === "percent-of") {
    const value = (first / 100) * second;
    return {
      ok: true,
      value,
      summary: `${display(first)}% of ${display(second)} is ${display(value)}.`,
    };
  }
  if (mode === "what-percent") {
    if (second === 0) return { ok: false, error: "The total cannot be zero." };
    const value = (first / second) * 100;
    return {
      ok: true,
      value,
      summary: `${display(first)} is ${display(value)}% of ${display(second)}.`,
    };
  }
  if (mode === "change") {
    if (first === 0)
      return {
        ok: false,
        error: "The starting value cannot be zero for percentage change.",
      };
    const value = ((second - first) / Math.abs(first)) * 100;
    const direction =
      value > 0 ? "increase" : value < 0 ? "decrease" : "change";
    return {
      ok: true,
      value,
      summary: `From ${display(first)} to ${display(second)} is a ${display(Math.abs(value))}% ${direction}.`,
    };
  }
  return { ok: false, error: "Select a supported percentage calculation." };
}
