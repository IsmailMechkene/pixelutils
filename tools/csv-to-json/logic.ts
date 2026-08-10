export type CsvResult =
  | { readonly ok: true; readonly value: string; readonly rows: number }
  | { readonly ok: false; readonly error: string };

function rows(input: string): string[][] | undefined {
  const output: string[][] = [[]]; let value = ""; let quoted = false;
  for (let index = 0; index < input.length; index += 1) {
    const character = input[index]; const next = input[index + 1];
    if (character === '"') { if (quoted && next === '"') { value += '"'; index += 1; } else quoted = !quoted; }
    else if (character === "," && !quoted) { output.at(-1)?.push(value); value = ""; }
    else if ((character === "\n" || character === "\r") && !quoted) { if (character === "\r" && next === "\n") index += 1; output.at(-1)?.push(value); output.push([]); value = ""; }
    else value += character;
  }
  if (quoted) return undefined;
  output.at(-1)?.push(value);
  return output.filter((row) => row.some((cell) => cell.length > 0));
}

export function csvToJson(input: string): CsvResult {
  if (!input.trim()) return { ok: false, error: "Enter CSV with a header row." };
  const parsed = rows(input);
  if (!parsed) return { ok: false, error: "Invalid CSV: an opening quote is not closed." };
  const [header, ...data] = parsed;
  if (!header || header.some((cell) => !cell.trim())) return { ok: false, error: "CSV headers must not be empty." };
  if (new Set(header).size !== header.length) return { ok: false, error: "CSV headers must be unique." };
  const value = data.map((row) => Object.fromEntries(header.map((key, index) => [key, row[index] ?? ""])));
  return { ok: true, value: JSON.stringify(value, null, 2), rows: value.length };
}
