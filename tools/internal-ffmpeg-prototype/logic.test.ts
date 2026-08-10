import { describe, expect, it } from "vitest";

import { getPrototypeVideoError, isSupportedPrototypeVideo, maxFfmpegPrototypeBytes } from "./logic";

describe("FFmpeg prototype file validation", () => {
  it("accepts MP4 and WebM MIME types and extensions", () => {
    expect(isSupportedPrototypeVideo({ name: "clip.MP4", type: "" } as File)).toBe(true);
    expect(isSupportedPrototypeVideo({ name: "clip", type: "video/webm" } as File)).toBe(true);
  });

  it("rejects unsupported, empty, and oversized files", () => {
    expect(getPrototypeVideoError({ name: "clip.mov", size: 1, type: "video/quicktime" } as File)).toContain("MP4 or WebM");
    expect(getPrototypeVideoError({ name: "clip.mp4", size: 0, type: "video/mp4" } as File)).toContain("empty");
    expect(getPrototypeVideoError({ name: "clip.mp4", size: maxFfmpegPrototypeBytes + 1, type: "video/mp4" } as File)).toContain("10 MB");
  });
});
