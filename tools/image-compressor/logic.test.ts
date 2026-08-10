import { describe, expect, it } from "vitest";

import {
  getCompressedFilename,
  getSizeChange,
  getSupportedImageMime,
  readImageDimensions,
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

  it("reads PNG, JPEG, and WebP dimensions before decoding", () => {
    const png = new Uint8Array(24);
    png.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], 0);
    png.set([0x49, 0x48, 0x44, 0x52], 12);
    new DataView(png.buffer).setUint32(16, 1_920);
    new DataView(png.buffer).setUint32(20, 1_080);

    const jpeg = new Uint8Array([
      0xff, 0xd8, 0xff, 0xc0, 0x00, 0x07, 0x08, 0x02, 0x58, 0x03, 0x20,
    ]);
    const webp = new Uint8Array(30);
    webp.set([0x52, 0x49, 0x46, 0x46], 0);
    webp.set([0x57, 0x45, 0x42, 0x50, 0x56, 0x50, 0x38, 0x58], 8);
    webp.set([0x7f, 0x02, 0x00], 24);
    webp.set([0xdf, 0x01, 0x00], 27);

    expect(readImageDimensions(png, "image/png")).toEqual({
      width: 1_920,
      height: 1_080,
    });
    expect(readImageDimensions(jpeg, "image/jpeg")).toEqual({
      width: 800,
      height: 600,
    });
    expect(readImageDimensions(webp, "image/webp")).toEqual({
      width: 640,
      height: 480,
    });
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
