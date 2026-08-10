import { describe, expect, it } from "vitest";

import {
  getCompressedFilename,
  getSizeChange,
  getSupportedImageMime,
  validateImageDimensions,
} from "./logic";

describe("image compressor helpers", () => {
  it("recognizes supported browser image formats from MIME types and extensions", () => {
    expect(
      getSupportedImageMime({ name: "photo.jpg", type: "image/jpeg" }),
    ).toBe("image/jpeg");
    expect(getSupportedImageMime({ name: "photo.WEBP", type: "" })).toBe(
      "image/webp",
    );
    expect(
      getSupportedImageMime({ name: "notes.txt", type: "text/plain" }),
    ).toBeUndefined();
  });

  it("uses a safe compressed filename for the selected output format", () => {
    expect(getCompressedFilename("holiday.photo.jpeg", "image/jpeg")).toBe(
      "holiday.photo-compressed.jpg",
    );
    expect(getCompressedFilename(".png", "image/png")).toBe(
      "image-compressed.png",
    );
  });

  it("reports savings and rejects unsafe decoded dimensions", () => {
    expect(getSizeChange(1_000, 650)).toEqual({
      percent: 35,
      label: "35% smaller",
    });
    expect(getSizeChange(1_000, 1_100)?.label).toBe("10% larger");
    expect(validateImageDimensions(8_000, 5_001)).toMatch(/40 megapixels/);
    expect(validateImageDimensions(800, 600)).toBeUndefined();
  });
});
