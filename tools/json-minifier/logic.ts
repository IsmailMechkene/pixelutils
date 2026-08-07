import type { JsonTransformResult } from "../json-formatter/logic";

export function minifyJson(input: string): JsonTransformResult {
  if (!input.trim()) {
    return { ok: false, error: "Enter JSON to minify." };
  }

  try {
    const parsed: unknown = JSON.parse(input);
    return { ok: true, value: JSON.stringify(parsed) };
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    return { ok: false, error: `Invalid JSON: ${detail}` };
  }
}
