import { describe, expect, it } from "vitest";

import { decodeJwt } from "./logic";

function segment(value: unknown) {
  return Buffer.from(JSON.stringify(value), "utf8").toString("base64url");
}

describe("decodeJwt", () => {
  it("decodes Unicode header and payload JSON without verifying a signature", () => {
    const token = `${segment({ alg: "HS256", typ: "JWT" })}.${segment({ sub: "café", admin: true })}.signature`;
    const result = decodeJwt(token);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(JSON.parse(result.header)).toEqual({ alg: "HS256", typ: "JWT" });
      expect(JSON.parse(result.payload)).toEqual({ sub: "café", admin: true });
      expect(result.signature).toBe("signature");
    }
  });

  it("rejects missing segments, malformed Base64URL, and non-object JSON", () => {
    expect(decodeJwt("one.two").ok).toBe(false);
    expect(decodeJwt("%%%.e30.signature").ok).toBe(false);
    expect(
      decodeJwt(`${segment([])}.${segment({ sub: 1 })}.signature`).ok,
    ).toBe(false);
  });

  it("rejects empty input", () => {
    expect(decodeJwt(" ")).toEqual({
      ok: false,
      error: "Enter a JWT to decode.",
    });
  });
});
