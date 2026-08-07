import { describe, expect, it } from "vitest";

import { generateUuidV4, generateUuids } from "./logic";

describe("UUID v4 generation", () => {
  it("sets the RFC version and variant bits", () => {
    const uuid = generateUuidV4(() => new Uint8Array(16));
    expect(uuid).toBe("00000000-0000-4000-8000-000000000000");
    expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  });

  it("generates the requested quantity", () => {
    let seed = 0;
    const values = generateUuids(3, (length) =>
      Uint8Array.from({ length }, () => (seed += 1)),
    );
    expect(values).toHaveLength(3);
    expect(new Set(values).size).toBe(3);
  });

  it("rejects unsafe quantities and invalid random sources", () => {
    expect(() => generateUuids(0, () => new Uint8Array(16))).toThrow(/1 to 100/);
    expect(() => generateUuidV4(() => new Uint8Array(15))).toThrow(/exactly 16/);
  });
});
