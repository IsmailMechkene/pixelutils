import { describe, expect, it } from "vitest";

import { convertColor } from "./logic";

describe("convertColor", () => {
  it("converts short and long HEX colors", () => {
    expect(convertColor("#f80")).toMatchObject({ ok: true, hex: "#FF8800", rgb: "rgb(255, 136, 0)", hsl: "hsl(32, 100%, 50%)" });
    expect(convertColor("#33669980")).toMatchObject({ ok: true, hex: "#33669980", rgb: "rgba(51, 102, 153, 0.502)" });
  });

  it("converts RGB and HSL primary colors", () => {
    expect(convertColor("rgb(255, 0, 0)")).toMatchObject({ ok: true, hex: "#FF0000", hsl: "hsl(0, 100%, 50%)" });
    expect(convertColor("hsl(120, 100%, 50%)")).toMatchObject({ ok: true, hex: "#00FF00", rgb: "rgb(0, 255, 0)" });
  });

  it("normalizes hue and rejects out-of-range components", () => {
    expect(convertColor("hsl(-120, 100%, 50%)")).toMatchObject({ ok: true, hex: "#0000FF" });
    expect(convertColor("rgb(256, 0, 0)").ok).toBe(false);
    expect(convertColor("hsl(0, 101%, 50%)").ok).toBe(false);
  });

  it("rejects empty and unsupported color syntax", () => {
    expect(convertColor("").ok).toBe(false);
    expect(convertColor("red").ok).toBe(false);
  });
});
