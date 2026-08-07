export type MarkdownResult =
  | { readonly ok: true; readonly value: string }
  | { readonly ok: false; readonly error: string };

const allowedTags = [
  "h1", "h2", "h3", "h4", "h5", "h6", "p", "br", "hr", "blockquote",
  "ul", "ol", "li", "strong", "em", "del", "code", "pre", "a", "table",
  "thead", "tbody", "tr", "th", "td",
];

export async function renderMarkdown(input: string): Promise<MarkdownResult> {
  if (!input.trim()) return { ok: false, error: "Enter Markdown to preview." };

  try {
    const [{ marked }, { default: sanitizeHtml }] = await Promise.all([
      import("marked"),
      import("sanitize-html"),
    ]);
    const generated = await marked.parse(input, { async: true, gfm: true });
    const value = sanitizeHtml(generated, {
      allowedTags,
      allowedAttributes: { a: ["href", "title"], code: ["class"] },
      allowedSchemes: ["http", "https", "mailto"],
      allowProtocolRelative: false,
      disallowedTagsMode: "discard",
    });
    return { ok: true, value };
  } catch (error) {
    return {
      ok: false,
      error: `Could not render this Markdown: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
