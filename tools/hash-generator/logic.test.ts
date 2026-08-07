import { describe, expect, it } from "vitest";

import { formatDigest, generateHash } from "./logic";

describe("hash generation helpers", () => {
  it("formats digest bytes as hexadecimal or Base64", () => {
    const buffer = Uint8Array.from([0, 15, 16, 255]).buffer;
    expect(formatDigest(buffer, "hex")).toBe("000f10ff");
    expect(formatDigest(buffer, "base64")).toBe("AA8Q/w==");
  });

  it("passes the selected algorithm and bytes to the injected digest", async () => {
    const calls: unknown[] = [];
    const result = await generateHash(
      Uint8Array.from([72, 105]),
      "SHA-256",
      "hex",
      async (algorithm, data) => {
        calls.push(algorithm, Array.from(data));
        return Uint8Array.from([1, 2, 3]).buffer;
      },
    );
    expect(result).toBe("010203");
    expect(calls).toEqual(["SHA-256", [72, 105]]);
  });

  it("rejects empty input and unsupported algorithms", async () => {
    const digest = async () => new ArrayBuffer(0);
    await expect(generateHash(new Uint8Array(), "SHA-256", "hex", digest)).rejects.toThrow(/Enter text/);
    await expect(generateHash(Uint8Array.of(1), "MD5" as "SHA-256", "hex", digest)).rejects.toThrow(/supported/);
  });
});
