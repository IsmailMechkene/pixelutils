export const hashAlgorithms = ["SHA-256", "SHA-384", "SHA-512", "SHA-1"] as const;
export type HashAlgorithm = (typeof hashAlgorithms)[number];
export type HashEncoding = "hex" | "base64";
export type DigestFunction = (algorithm: HashAlgorithm, data: Uint8Array) => Promise<ArrayBuffer>;

function bytesToBase64(bytes: Uint8Array) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  let output = "";
  for (let index = 0; index < bytes.length; index += 3) {
    const first = bytes[index] ?? 0, second = bytes[index + 1], third = bytes[index + 2];
    const chunk = (first << 16) | ((second ?? 0) << 8) | (third ?? 0);
    output += alphabet[(chunk >> 18) & 63] + alphabet[(chunk >> 12) & 63];
    output += second === undefined ? "=" : alphabet[(chunk >> 6) & 63];
    output += third === undefined ? "=" : alphabet[chunk & 63];
  }
  return output;
}

export function formatDigest(buffer: ArrayBuffer, encoding: HashEncoding) {
  const bytes = new Uint8Array(buffer);
  return encoding === "hex"
    ? Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("")
    : bytesToBase64(bytes);
}

export async function generateHash(
  data: Uint8Array,
  algorithm: HashAlgorithm,
  encoding: HashEncoding,
  digest: DigestFunction,
) {
  if (data.length === 0) throw new Error("Enter text to hash.");
  if (!hashAlgorithms.includes(algorithm)) throw new Error("Select a supported hash algorithm.");
  return formatDigest(await digest(algorithm, data), encoding);
}
