import { decodeBase64 } from "../base64/logic";

export type JwtDecodeResult =
  | {
      readonly ok: true;
      readonly header: string;
      readonly payload: string;
      readonly signature: string;
    }
  | { readonly ok: false; readonly error: string };

function decodeSegment(segment: string, label: string) {
  const standard = segment.replace(/-/g, "+").replace(/_/g, "/");
  const padded = standard.padEnd(Math.ceil(standard.length / 4) * 4, "=");
  const decoded = decodeBase64(padded);
  if (!decoded.ok)
    throw new Error(`${label} is not valid Base64URL: ${decoded.error}`);
  try {
    const parsed: unknown = JSON.parse(decoded.value);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error(`${label} must contain a JSON object.`);
    }
    return JSON.stringify(parsed, null, 2);
  } catch (error) {
    if (error instanceof Error && error.message.startsWith(label)) throw error;
    throw new Error(
      `${label} is not valid JSON: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

export function decodeJwt(input: string): JwtDecodeResult {
  const token = input.trim();
  if (!token) return { ok: false, error: "Enter a JWT to decode." };
  const parts = token.split(".");
  if (parts.length !== 3 || parts.some((part) => !part)) {
    return {
      ok: false,
      error: "A JWT must contain three non-empty dot-separated segments.",
    };
  }
  try {
    return {
      ok: true,
      header: decodeSegment(parts[0] ?? "", "Header"),
      payload: decodeSegment(parts[1] ?? "", "Payload"),
      signature: parts[2] ?? "",
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
