import { describe, expect, it } from "vitest";

import { inspectImageMetadata } from "./logic";

function makeExifJpeg() {
  const tiff = new Uint8Array(120);
  const view = new DataView(tiff.buffer);
  tiff.set([0x4d, 0x4d]);
  view.setUint16(2, 42);
  view.setUint32(4, 8);
  view.setUint16(8, 2);
  view.setUint16(10, 0x010f);
  view.setUint16(12, 2);
  view.setUint32(14, 6);
  view.setUint32(18, 40);
  view.setUint16(22, 0x0112);
  view.setUint16(24, 3);
  view.setUint32(26, 1);
  view.setUint16(30, 6);
  tiff.set(new TextEncoder().encode("Canon\0"), 40);
  const payload = new Uint8Array(6 + tiff.length);
  payload.set(new TextEncoder().encode("Exif\0\0"));
  payload.set(tiff, 6);
  const jpeg = new Uint8Array(6 + payload.length);
  jpeg.set([0xff, 0xd8, 0xff, 0xe1]);
  const jpegView = new DataView(jpeg.buffer);
  jpegView.setUint16(4, payload.length + 2);
  jpeg.set(payload, 6);
  return jpeg;
}

describe("image metadata inspection", () => {
  it("reads common EXIF text and orientation fields", () => {
    const fields = inspectImageMetadata(makeExifJpeg(), "image/jpeg");
    expect(fields).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: "Camera make", value: "Canon" }),
        expect.objectContaining({ label: "Orientation", value: "6" }),
      ]),
    );
  });

  it("reads PNG text chunks", () => {
    const text = new TextEncoder().encode("Comment\0Made locally");
    const png = new Uint8Array(8 + 12 + text.length);
    png.set([137, 80, 78, 71, 13, 10, 26, 10]);
    const view = new DataView(png.buffer);
    view.setUint32(8, text.length);
    png.set(new TextEncoder().encode("tEXt"), 12);
    png.set(text, 16);
    expect(inspectImageMetadata(png, "image/png")).toContainEqual({
      group: "Other",
      label: "Comment",
      value: "Made locally",
    });
  });
});
