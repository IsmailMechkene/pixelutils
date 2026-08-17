import { describe, expect, it } from "vitest";

import {
  createIco,
  createInstallSnippet,
  createStoredZip,
  createWebManifest,
  getFaviconPngName,
} from "./logic";

describe("favicon generator helpers", () => {
  it("uses conventional names for standard favicon sizes", () => {
    expect(getFaviconPngName(16)).toBe("favicon-16x16.png");
    expect(getFaviconPngName(180)).toBe("apple-touch-icon.png");
    expect(getFaviconPngName(512)).toBe("android-chrome-512x512.png");
  });

  it("writes a PNG-backed multi-image ICO", () => {
    const ico = createIco([
      { size: 16, data: new Uint8Array([1, 2]) },
      { size: 32, data: new Uint8Array([3, 4, 5]) },
    ]);
    const view = new DataView(ico.buffer);

    expect(view.getUint16(2, true)).toBe(1);
    expect(view.getUint16(4, true)).toBe(2);
    expect(ico.slice(38)).toEqual(new Uint8Array([1, 2, 3, 4, 5]));
  });

  it("writes a standards-compatible stored ZIP structure", () => {
    const zip = createStoredZip([
      { name: "hello.txt", data: new TextEncoder().encode("hello") },
    ]);
    const view = new DataView(zip.buffer);

    expect(view.getUint32(0, true)).toBe(0x04034b50);
    expect(view.getUint32(zip.length - 22, true)).toBe(0x06054b50);
    expect(new TextDecoder().decode(zip)).toContain("hello.txt");
  });

  it("creates usable manifest and head markup", () => {
    expect(createWebManifest("PixelUtils")).toContain('"name": "PixelUtils"');
    expect(createWebManifest("PixelUtils")).toContain(
      "android-chrome-192x192.png",
    );
    expect(createInstallSnippet()).toContain('rel="manifest"');
  });
});
