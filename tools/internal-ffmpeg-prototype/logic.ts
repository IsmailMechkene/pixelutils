export const ffmpegPrototypeAccept = "video/mp4,video/webm,.mp4,.webm";
export const maxFfmpegPrototypeBytes = 10 * 1024 * 1024;

const acceptedMimeTypes = new Set(["video/mp4", "video/webm"]);
const acceptedExtensions = new Set(["mp4", "webm"]);

export function isSupportedPrototypeVideo(file: Pick<File, "name" | "type">) {
  const extension = file.name.split(".").pop()?.toLowerCase();
  return acceptedMimeTypes.has(file.type) || Boolean(extension && acceptedExtensions.has(extension));
}

export function getPrototypeVideoError(file: Pick<File, "name" | "type" | "size">) {
  if (!isSupportedPrototypeVideo(file)) return "Choose a small MP4 or WebM video for this internal test.";
  if (file.size === 0) return "This video file is empty.";
  if (file.size > maxFfmpegPrototypeBytes) return "This internal prototype accepts videos up to 10 MB.";
  return undefined;
}
