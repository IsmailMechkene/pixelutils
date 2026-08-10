export type CsvResult =
  | { readonly ok: true; readonly value: string; readonly rows: number }
  | { readonly ok: false; readonly error: string };

type ParsedRows = { readonly ok: true; readonly value: string[][] } | { readonly ok: false; readonly error: string };

function rows(input: string): ParsedRows {
  const output: string[][] = [[]]; let value = ""; let quoted = false; let fieldStarted = false; let closedQuote = false;
  for (let index = 0; index < input.length; index += 1) {
    const character = input[index]; const next = input[index + 1];
    if (character === '"') {
      if (!quoted && fieldStarted) return { ok: false, error: "Invalid CSV: quotes can only begin a field." };
      if (quoted && next === '"') { value += '"'; index += 1; }
      else { quoted = !quoted; closedQuote = !quoted; }
    } else if (character === "," && !quoted) { output.at(-1)?.push(value); value = ""; fieldStarted = false; closedQuote = false; }
    else if ((character === "\n" || character === "\r") && !quoted) { if (character === "\r" && next === "\n") index += 1; output.at(-1)?.push(value); output.push([]); value = ""; fieldStarted = false; closedQuote = false; }
    else {
      if (!quoted && closedQuote) return { ok: false, error: "Invalid CSV: unexpected text after a closing quote." };
      value += character; fieldStarted = true;
    }
  }
  if (quoted) return { ok: false, error: "Invalid CSV: an opening quote is not closed." };
  output.at(-1)?.push(value);
  return { ok: true, value: output.filter((row) => row.some((cell) => cell.length > 0)) };
}

export function csvToJson(input: string): CsvResult {
  if (!input.trim()) return { ok: false, error: "Enter CSV with a header row." };
  const parsed = rows(input);
  if (!parsed.ok) return parsed;
  const [header, ...data] = parsed.value;
  if (!header || header.some((cell) => !cell.trim())) return { ok: false, error: "CSV headers must not be empty." };
  if (new Set(header).size !== header.length) return { ok: false, error: "CSV headers must be unique." };
  const invalidRow = data.findIndex((row) => row.length !== header.length);
  if (invalidRow >= 0) return { ok: false, error: `CSV row ${invalidRow + 2} has ${data[invalidRow]?.length} values; expected ${header.length}.` };
  const value = data.map((row) => Object.fromEntries(header.map((key, index) => [key, row[index] ?? ""])));
  return { ok: true, value: JSON.stringify(value, null, 2), rows: value.length };
}
