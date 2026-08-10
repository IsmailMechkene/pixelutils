export type YamlFormatResult =
  | { readonly ok: true; readonly value: string }
  | { readonly ok: false; readonly error: string };

export async function formatYaml(input: string): Promise<YamlFormatResult> {
  if (!input.trim()) return { ok: false, error: "Enter YAML to format." };
  try {
    const { parseDocument } = await import("yaml");
    const document = parseDocument(input, { prettyErrors: true, strict: true });
    if (document.errors.length > 0) {
      return { ok: false, error: `Invalid YAML: ${document.errors[0]?.message}` };
    }
    return { ok: true, value: document.toString().trimEnd() };
  } catch (error) {
    return { ok: false, error: `Invalid YAML: ${error instanceof Error ? error.message : String(error)}` };
  }
}
