export type PasswordRandomBytes = (length: number) => Uint8Array;

export interface PasswordOptions {
  readonly length: number;
  readonly uppercase: boolean;
  readonly lowercase: boolean;
  readonly numbers: boolean;
  readonly symbols: boolean;
  readonly excludeAmbiguous: boolean;
}

const characterSets = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.?",
} as const;
const ambiguous = new Set("Il1O0o");

function secureIndex(max: number, randomBytes: PasswordRandomBytes) {
  const ceiling = Math.floor(256 / max) * max;
  for (let attempt = 0; attempt < 1024; attempt += 1) {
    const bytes = randomBytes(1);
    if (bytes.length !== 1)
      throw new Error("The random source must return one byte.");
    const value = bytes[0] ?? 0;
    if (value < ceiling) return value % max;
  }
  throw new Error("The random source did not provide a usable value.");
}

export function generatePassword(
  options: PasswordOptions,
  randomBytes: PasswordRandomBytes,
) {
  if (
    !Number.isInteger(options.length) ||
    options.length < 8 ||
    options.length > 128
  ) {
    throw new Error("Password length must be a whole number from 8 to 128.");
  }

  const selected = (
    ["uppercase", "lowercase", "numbers", "symbols"] as const
  ).filter((name) => options[name]);
  if (selected.length === 0)
    throw new Error("Select at least one character type.");
  if (options.length < selected.length) {
    throw new Error(
      "Password length is too short for the selected character types.",
    );
  }

  const pools = selected.map((name) => {
    const source = characterSets[name];
    return options.excludeAmbiguous
      ? Array.from(source)
          .filter((character) => !ambiguous.has(character))
          .join("")
      : source;
  });
  if (pools.some((pool) => pool.length === 0)) {
    throw new Error(
      "The selected options do not contain any usable characters.",
    );
  }

  const combined = pools.join("");
  const password = pools.map(
    (pool) => pool[secureIndex(pool.length, randomBytes)] ?? "",
  );
  while (password.length < options.length) {
    password.push(combined[secureIndex(combined.length, randomBytes)] ?? "");
  }
  for (let index = password.length - 1; index > 0; index -= 1) {
    const other = secureIndex(index + 1, randomBytes);
    [password[index], password[other]] = [
      password[other] ?? "",
      password[index] ?? "",
    ];
  }
  return password.join("");
}
