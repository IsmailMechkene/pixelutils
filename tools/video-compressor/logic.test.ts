import { describe, expect, it } from "vitest";

import { getCompressedVideoFilename, getCompressionCommand, getSizeReduction, maxVideoCompressorBytes } from "./logic";

describe("video compressor helpers", () => {
  it("creates a capped, non-upscaling command", () => {
    expect(getCompressionCommand({ inputPath: "in.webm", outputPath: "out.mp4", preset: "balanced", resolution: "720" })).toEqual(expect.arrayContaining(["-vf", "scale=w='min(iw,720)':h=-2", "-crf", "27"]));
  });
  it("creates safe output names and accurate reductions", () => {
    expect(getCompressedVideoFilename("holiday.final.mov")).toBe("holiday.final-compressed.mp4");
    expect(getSizeReduction(1000, 750)).toBe(25);
    expect(getSizeReduction(1000, 1100)).toBe(-10);
    expect(maxVideoCompressorBytes).toBe(104857600);
  });
});
