export const videoCompressorAccept = "video/*,.mp4,.webm,.mkv,.mov,.avi,.m4v";
export const maxVideoCompressorBytes = 100 * 1024 * 1024;
export const largeVideoCompressorBytes = 50 * 1024 * 1024;

export const qualityPresets = ["smaller", "balanced", "higher"] as const;
export type VideoQualityPreset = (typeof qualityPresets)[number];

export const resolutionOptions = ["original", "1080", "720", "480"] as const;
export type VideoResolutionOption = (typeof resolutionOptions)[number];

const recognizedExtensions = new Set(["mp4", "webm", "mkv", "mov", "avi", "m4v"]);

export function getVideoCompressorError(file: Pick<File, "name" | "type" | "size">) {
  const extension = file.name.split(".").at(-1)?.toLowerCase();
  if (!file.type.startsWith("video/") && !recognizedExtensions.has(extension ?? "")) return "Choose a video file supported by your browser.";
  if (file.size === 0) return "This video file is empty.";
  if (file.size > maxVideoCompressorBytes) return "This first version supports videos up to 100 MB to protect browser memory.";
  return undefined;
}

export function getCompressedVideoFilename(filename: string) {
  const stem = filename.replace(/\.[^.]+$/, "").trim() || "video";
  return `${stem}-compressed.mp4`;
}

export function getCompressionCommand({ inputPath, outputPath, preset, resolution }: { readonly inputPath: string; readonly outputPath: string; readonly preset: VideoQualityPreset; readonly resolution: VideoResolutionOption; }) {
  const crf = preset === "smaller" ? "32" : preset === "balanced" ? "27" : "23";
  const audioBitrate = preset === "smaller" ? "128k" : preset === "balanced" ? "160k" : "192k";
  const scale = resolution === "original" ? undefined : `scale=w='min(iw,${resolution})':h=-2`;
  return [
    "-i", inputPath,
    "-map", "0:v:0", "-map", "0:a?",
    ...(scale ? ["-vf", scale] : []),
    "-c:v", "libx264", "-preset", "veryfast", "-crf", crf,
    "-c:a", "aac", "-b:a", audioBitrate,
    "-movflags", "+faststart", outputPath,
  ];
}

export function getSizeReduction(originalBytes: number, outputBytes: number) {
  if (originalBytes <= 0 || outputBytes < 0) return undefined;
  const percentage = ((originalBytes - outputBytes) / originalBytes) * 100;
  return Math.round(percentage * 10) / 10;
}
