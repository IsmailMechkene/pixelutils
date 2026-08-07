import { describe, expect, it } from "vitest";

import { decodeBase64, encodeBase64 } from "./logic";

describe("Base64 text encoding", () => {
  it("round-trips ASCII, accents, emoji, and non-Latin scripts", () => {
    const input = "Hello, café 👋 世界";
    const encoded = encodeBase64(input);
    expect(encoded).toEqual({
      ok: true,
      value: "SGVsbG8sIGNhZsOpIPCfkYsg5LiW55WM",
    });
    if (encoded.ok)
      expect(decodeBase64(encoded.value)).toEqual({ ok: true, value: input });
  });

  it("rejects empty encoding and ignores decode whitespace", () => {
    expect(encodeBase64("")).toEqual({
      ok: false,
      error: "Enter text to encode.",
    });
    expect(decodeBase64("SGVs\n bG8=")).toEqual({ ok: true, value: "Hello" });
  });

  it("rejects malformed Base64 and invalid UTF-8", () => {
    expect(decodeBase64("not base64!")).toEqual({
      ok: false,
      error: "Invalid Base64: check the characters and padding.",
    });
    expect(decodeBase64("/w==")).toEqual({
      ok: false,
      error: "Decoded bytes are not valid UTF-8 text.",
    });
  });
});
