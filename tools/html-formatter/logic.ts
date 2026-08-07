export type HtmlFormatResult =
  | { readonly ok: true; readonly value: string }
  | { readonly ok: false; readonly error: string };

export async function formatHtml(input: string): Promise<HtmlFormatResult> {
  if (!input.trim()) return { ok: false, error: "Enter HTML to format." };

  try {
    const [{ format }, htmlPlugin] = await Promise.all([
      import("prettier/standalone"),
      import("prettier/plugins/html"),
    ]);
    const value = await format(input, {
      parser: "html",
      plugins: [htmlPlugin],
      printWidth: 80,
      tabWidth: 2,
      useTabs: false,
      htmlWhitespaceSensitivity: "css",
    });
    return { ok: true, value: value.trimEnd() };
  } catch (error) {
    return {
      ok: false,
      error: `Could not format this HTML: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
