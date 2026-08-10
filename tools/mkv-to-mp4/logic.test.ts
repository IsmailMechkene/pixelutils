import { describe, expect, it } from "vitest";

import {
  assessMkvCompatibility,
  getMp4Filename,
  getMkvToMp4FileError,
  maxMkvToMp4Bytes,
} from "./logic";

describe("MKV to MP4 planning", () => {
  it("allows a conservative H.264/AAC stream copy", () => {
    expect(
      assessMkvCompatibility({
        format: { duration: "12.5" },
        streams: [
          { codec_type: "video", codec_name: "h264" },
          { codec_type: "audio", codec_name: "aac" },
        ],
      }),
    ).toEqual({
      canStreamCopy: true,
      durationSeconds: 12.5,
      reason: "The primary video and audio streams are compatible with a quality-preserving MP4 copy.",
    });
  });

  it("requires explicit fallback for incompatible codecs", () => {
    expect(
      assessMkvCompatibility({ streams: [{ codec_type: "video", codec_name: "vp9" }] }),
    ).toMatchObject({ canStreamCopy: false, reason: expect.stringContaining("video codec") });
  });

  it("validates input limits and preserves a multi-dot filename stem", () => {
    expect(getMkvToMp4FileError({ name: "movie.MKV", type: "", size: 1 })).toBeUndefined();
    expect(getMkvToMp4FileError({ name: "video.mp4", type: "video/mp4", size: 1 })).toBe("Choose an MKV video file.");
    expect(getMkvToMp4FileError({ name: "large.mkv", type: "", size: maxMkvToMp4Bytes + 1 })).toContain("100 MB");
    expect(getMp4Filename("holiday.cut.final.mkv")).toBe("holiday.cut.final.mp4");
  });
});
