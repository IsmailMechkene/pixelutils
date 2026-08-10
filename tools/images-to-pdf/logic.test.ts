import { describe, expect, it } from "vitest";

import { getImagePdfLayout, validateImageCollection } from "./logic";

describe("getImagePdfLayout", () => {
  it("fits a wide image inside a portrait A4 page without distortion", () => {
    const layout = getImagePdfLayout(
      { width: 1600, height: 900 },
      "a4",
      "portrait",
      "normal",
    );
    expect(layout.page).toEqual({ width: 595.28, height: 841.89 });
    expect(layout.image.width / layout.image.height).toBeCloseTo(1600 / 900);
    expect(layout.image.width).toBeLessThanOrEqual(595.28 - 72);
  });

  it("keeps auto pages fitted to the image plus margin", () => {
    expect(getImagePdfLayout({ width: 100, height: 50 }, "auto", "auto", "small")).toEqual({
      page: { width: 136, height: 86 },
      image: { x: 18, y: 18, width: 100, height: 50 },
    });
  });
});

describe("validateImageCollection", () => {
  it("rejects large aggregate collections", () => {
    expect(validateImageCollection([{ size: 101 * 1024 * 1024 }])).toContain("100 MB");
  });
});
