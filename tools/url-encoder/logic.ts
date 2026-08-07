export type UrlMode = "component" | "full-url";
export type UrlTransformResult =
  | { readonly ok: true; readonly value: string }
  | { readonly ok: false; readonly error: string };

export function encodeUrl(input: string, mode: UrlMode): UrlTransformResult {
  if (!input) return { ok: false, error: "Enter text or a URL to encode." };
  try {
    return {
      ok: true,
      value: mode === "component" ? encodeURIComponent(input) : encodeURI(input),
    };
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    return { ok: false, error: `Could not encode the input: ${detail}` };
  }
}

export function decodeUrl(input: string, mode: UrlMode): UrlTransformResult {
  if (!input) return { ok: false, error: "Enter encoded text or a URL to decode." };
  try {
    return {
      ok: true,
      value: mode === "component" ? decodeURIComponent(input) : decodeURI(input),
    };
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    return { ok: false, error: `Invalid percent-encoding: ${detail}` };
  }
}
