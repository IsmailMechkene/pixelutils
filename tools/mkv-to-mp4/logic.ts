export const mkvToMp4Accept = "video/x-matroska,video/matroska,.mkv";
export const maxMkvToMp4Bytes = 100 * 1024 * 1024;
export const largeMkvToMp4Bytes = 50 * 1024 * 1024;

const mkvMimeTypes = new Set(["video/x-matroska", "video/matroska"]);

export interface FfmpegProbeStream {
  readonly codec_name?: string;
  readonly codec_type?: string;
}

export interface FfmpegProbeResult {
  readonly format?: { readonly duration?: string };
  readonly streams?: readonly FfmpegProbeStream[];
}

export interface MkvCompatibility {
  readonly canStreamCopy: boolean;
  readonly reason: string;
  readonly durationSeconds?: number;
}

function extensionOf(filename: string) {
  return filename.split(".").at(-1)?.toLowerCase();
}

export function isMkvFile(file: Pick<File, "name" | "type">) {
  return mkvMimeTypes.has(file.type.toLowerCase()) || extensionOf(file.name) === "mkv";
}

export function getMkvToMp4FileError(file: Pick<File, "name" | "type" | "size">) {
  if (!isMkvFile(file)) return "Choose an MKV video file.";
  if (file.size === 0) return "This MKV file is empty.";
  if (file.size > maxMkvToMp4Bytes) {
    return "This first version supports MKV files up to 100 MB to protect browser memory.";
  }
  return undefined;
}

export function getMp4Filename(filename: string) {
  const stem = filename.replace(/\.[^.]+$/, "").trim() || "converted-video";
  return `${stem}.mp4`;
}

export function assessMkvCompatibility(probe: FfmpegProbeResult): MkvCompatibility {
  const streams = probe.streams ?? [];
  const videoStreams = streams.filter((stream) => stream.codec_type === "video");
  const audioStreams = streams.filter((stream) => stream.codec_type === "audio");
  const duration = Number(probe.format?.duration);
  const durationSeconds = Number.isFinite(duration) && duration > 0 ? duration : undefined;

  if (videoStreams.length !== 1) {
    return { canStreamCopy: false, reason: "This file does not contain one supported primary video stream.", durationSeconds };
  }

  const videoCodec = videoStreams[0]?.codec_name?.toLowerCase();
  if (videoCodec !== "h264" && videoCodec !== "hevc") {
    return { canStreamCopy: false, reason: "Its video codec needs re-encoding for a reliable MP4 file.", durationSeconds };
  }

  const unsupportedAudio = audioStreams.find((stream) => {
    const codec = stream.codec_name?.toLowerCase();
    return codec !== "aac" && codec !== "mp3";
  });
  if (unsupportedAudio) {
    return { canStreamCopy: false, reason: "Its audio codec needs re-encoding for a reliable MP4 file.", durationSeconds };
  }

  return {
    canStreamCopy: true,
    reason: "The primary video and audio streams are compatible with a quality-preserving MP4 copy.",
    durationSeconds,
  };
}
