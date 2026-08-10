import { describe, expect, it } from "vitest";
import { formatYaml } from "./logic";

describe("formatYaml", () => {
  it("formats valid YAML", async () => {
    await expect(formatYaml("name: PixelUtils\nitems: [one,two]")).resolves.toEqual({ ok: true, value: "name: PixelUtils\nitems: [ one, two ]" });
  });
  it("rejects empty and invalid YAML", async () => {
    await expect(formatYaml(" ")).resolves.toEqual({ ok: false, error: "Enter YAML to format." });
    expect((await formatYaml("items: [one")).ok).toBe(false);
  });
});
