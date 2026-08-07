import { decode } from "he";

export type HtmlEntityResult =
  | { readonly ok: true; readonly value: string }
  | { readonly ok: false; readonly error: string };

const escapeMap: Readonly<Record<string, string>> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function escapeHtml(input: string): HtmlEntityResult {
  if (!input) return { ok: false, error: "Enter text or HTML to escape." };
  return {
    ok: true,
    value: input.replace(/[&<>"']/g, (character) => escapeMap[character] ?? character),
  };
}

export function unescapeHtml(input: string): HtmlEntityResult {
  if (!input) return { ok: false, error: "Enter HTML entities to unescape." };
  try {
    return { ok: true, value: decode(input, { isAttributeValue: false, strict: false }) };
  } catch (error) {
    return {
      ok: false,
      error: `Could not decode the HTML entities: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
