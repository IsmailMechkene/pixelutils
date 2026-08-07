export type Base64Result =
  | { readonly ok: true; readonly value: string }
  | { readonly ok: false; readonly error: string };

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

function stringToUtf8(input: string) {
  const bytes: number[] = [];
  for (const character of input) {
    let point = character.codePointAt(0) ?? 0;
    if (point >= 0xd800 && point <= 0xdfff) point = 0xfffd;

    if (point <= 0x7f) bytes.push(point);
    else if (point <= 0x7ff) {
      bytes.push(0xc0 | (point >> 6), 0x80 | (point & 0x3f));
    } else if (point <= 0xffff) {
      bytes.push(
        0xe0 | (point >> 12),
        0x80 | ((point >> 6) & 0x3f),
        0x80 | (point & 0x3f),
      );
    } else {
      bytes.push(
        0xf0 | (point >> 18),
        0x80 | ((point >> 12) & 0x3f),
        0x80 | ((point >> 6) & 0x3f),
        0x80 | (point & 0x3f),
      );
    }
  }
  return bytes;
}

function utf8ToString(bytes: readonly number[]) {
  const points: number[] = [];
  for (let index = 0; index < bytes.length; ) {
    const first = bytes[index];
    if (first === undefined) break;
    let point: number;
    let length: number;
    let minimum: number;

    if (first <= 0x7f) {
      point = first;
      length = 1;
      minimum = 0;
    } else if (first >= 0xc2 && first <= 0xdf) {
      point = first & 0x1f;
      length = 2;
      minimum = 0x80;
    } else if (first >= 0xe0 && first <= 0xef) {
      point = first & 0x0f;
      length = 3;
      minimum = 0x800;
    } else if (first >= 0xf0 && first <= 0xf4) {
      point = first & 0x07;
      length = 4;
      minimum = 0x10000;
    } else {
      throw new Error("Decoded bytes are not valid UTF-8 text.");
    }

    if (index + length > bytes.length) {
      throw new Error("Decoded bytes end in an incomplete UTF-8 character.");
    }
    for (let offset = 1; offset < length; offset += 1) {
      const next = bytes[index + offset];
      if (next === undefined || (next & 0xc0) !== 0x80) {
        throw new Error("Decoded bytes are not valid UTF-8 text.");
      }
      point = (point << 6) | (next & 0x3f);
    }
    if (
      point < minimum ||
      point > 0x10ffff ||
      (point >= 0xd800 && point <= 0xdfff)
    ) {
      throw new Error("Decoded bytes are not valid UTF-8 text.");
    }
    points.push(point);
    index += length;
  }
  return String.fromCodePoint(...points);
}

export function encodeBase64(input: string): Base64Result {
  if (!input) return { ok: false, error: "Enter text to encode." };
  const bytes = stringToUtf8(input);
  let output = "";
  for (let index = 0; index < bytes.length; index += 3) {
    const first = bytes[index] ?? 0;
    const second = bytes[index + 1];
    const third = bytes[index + 2];
    const chunk = (first << 16) | ((second ?? 0) << 8) | (third ?? 0);
    output += alphabet[(chunk >> 18) & 63];
    output += alphabet[(chunk >> 12) & 63];
    output += second === undefined ? "=" : alphabet[(chunk >> 6) & 63];
    output += third === undefined ? "=" : alphabet[chunk & 63];
  }
  return { ok: true, value: output };
}

export function decodeBase64(input: string): Base64Result {
  const normalized = input.replace(/\s+/g, "");
  if (!normalized) return { ok: false, error: "Enter Base64 text to decode." };
  if (
    normalized.length % 4 !== 0 ||
    !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(
      normalized,
    )
  ) {
    return { ok: false, error: "Invalid Base64: check the characters and padding." };
  }

  const bytes: number[] = [];
  for (let index = 0; index < normalized.length; index += 4) {
    const values = normalized
      .slice(index, index + 4)
      .split("")
      .map((character) => (character === "=" ? 0 : alphabet.indexOf(character)));
    const chunk =
      ((values[0] ?? 0) << 18) |
      ((values[1] ?? 0) << 12) |
      ((values[2] ?? 0) << 6) |
      (values[3] ?? 0);
    bytes.push((chunk >> 16) & 0xff);
    if (normalized[index + 2] !== "=") bytes.push((chunk >> 8) & 0xff);
    if (normalized[index + 3] !== "=") bytes.push(chunk & 0xff);
  }

  try {
    return { ok: true, value: utf8ToString(bytes) };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
}
