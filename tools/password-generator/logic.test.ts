import { describe, expect, it } from "vitest";

import { generatePassword } from "./logic";

const defaults = {
  length: 24,
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true,
  excludeAmbiguous: true,
} as const;

function sequenceSource() {
  let value = 0;
  return (length: number) =>
    Uint8Array.from({ length }, () => {
      value = (value + 37) % 256;
      return value;
    });
}

describe("generatePassword", () => {
  it("uses the requested length and includes every selected character type", () => {
    const password = generatePassword(defaults, sequenceSource());
    expect(password).toHaveLength(24);
    expect(password).toMatch(/[A-Z]/);
    expect(password).toMatch(/[a-z]/);
    expect(password).toMatch(/[0-9]/);
    expect(password).toMatch(/[!@#$%^&*()\-_=+[\]{};:,.?]/);
  });

  it("excludes ambiguous characters when requested", () => {
    const password = generatePassword({ ...defaults, length: 128 }, sequenceSource());
    expect(password).not.toMatch(/[Il1O0o]/);
  });

  it("supports a single selected character set", () => {
    const password = generatePassword(
      {
        ...defaults,
        uppercase: false,
        numbers: false,
        symbols: false,
      },
      sequenceSource(),
    );
    expect(password).toMatch(/^[a-z]+$/);
  });

  it("rejects invalid options and random sources", () => {
    expect(() => generatePassword({ ...defaults, length: 7 }, sequenceSource())).toThrow(
      /8 to 128/,
    );
    expect(() =>
      generatePassword(
        { ...defaults, uppercase: false, lowercase: false, numbers: false, symbols: false },
        sequenceSource(),
      ),
    ).toThrow(/at least one/);
    expect(() => generatePassword(defaults, () => new Uint8Array(0))).toThrow(/one byte/);
  });
});
