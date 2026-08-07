export type RandomBytes = (length: number) => Uint8Array;

export function generateUuidV4(randomBytes: RandomBytes) {
  const bytes = randomBytes(16);
  if (bytes.length !== 16) {
    throw new Error("The random source must return exactly 16 bytes.");
  }
  const value = Uint8Array.from(bytes);
  value[6] = ((value[6] ?? 0) & 0x0f) | 0x40;
  value[8] = ((value[8] ?? 0) & 0x3f) | 0x80;
  const hex = Array.from(value, (byte) => byte.toString(16).padStart(2, "0"));
  return `${hex.slice(0, 4).join("")}-${hex.slice(4, 6).join("")}-${hex.slice(6, 8).join("")}-${hex.slice(8, 10).join("")}-${hex.slice(10).join("")}`;
}

export function generateUuids(count: number, randomBytes: RandomBytes) {
  if (!Number.isInteger(count) || count < 1 || count > 100) {
    throw new Error("Quantity must be a whole number from 1 to 100.");
  }
  return Array.from({ length: count }, () => generateUuidV4(randomBytes));
}
