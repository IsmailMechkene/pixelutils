export interface DuplicateLineOptions {
  readonly caseSensitive: boolean;
  readonly trimForComparison: boolean;
  readonly removeEmptyLines: boolean;
}

export interface DuplicateLineResult {
  readonly value: string;
  readonly removed: number;
  readonly kept: number;
}

export function removeDuplicateLines(
  input: string,
  options: DuplicateLineOptions,
): DuplicateLineResult {
  if (!input) return { value: "", removed: 0, kept: 0 };
  const seen = new Set<string>();
  const kept: string[] = [];
  let removed = 0;

  for (const line of input.split(/\r\n|\r|\n/)) {
    const trimmed = line.trim();
    if (options.removeEmptyLines && !trimmed) {
      removed += 1;
      continue;
    }
    const comparison = options.trimForComparison ? trimmed : line;
    const key = options.caseSensitive
      ? comparison
      : comparison.toLocaleLowerCase();
    if (seen.has(key)) {
      removed += 1;
      continue;
    }
    seen.add(key);
    kept.push(line);
  }

  return { value: kept.join("\n"), removed, kept: kept.length };
}
