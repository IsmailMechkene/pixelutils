export type JsonTransformResult =
  | { readonly ok: true; readonly value: string }
  | { readonly ok: false; readonly error: string };

export function formatJson(input: string, indentation = 2): JsonTransformResult {
  if (!input.trim()) {
    return { ok: false, error: "Enter JSON to format." };
  }

  if (!Number.isInteger(indentation) || indentation < 0 || indentation > 10) {
    return { ok: false, error: "Indentation must be a whole number from 0 to 10." };
  }

  try {
    const parsed: unknown = JSON.parse(input);
    return { ok: true, value: JSON.stringify(parsed, null, indentation) };
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    return { ok: false, error: `Invalid JSON: ${detail}` };
  }
}
