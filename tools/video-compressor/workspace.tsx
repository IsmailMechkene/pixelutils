"use client";

import { useEffect, useRef, useState } from "react";

import { FilePicker, FileResult, ProcessingStatus } from "@/components/file-tools";
import { ActionButton } from "@/components/tool-shell/action-button";
import { ClearButton } from "@/components/tool-shell/clear-button";
import { ToolActions } from "@/components/tool-shell/tool-actions";
import { ToolNotice } from "@/components/tool-shell/tool-notice";
import { formatFileSize } from "@/lib/file-tools/format";
import type { FileToolResult, FileToolStatus } from "@/lib/file-tools/types";
import { createFfmpegEngine, type FfmpegEngine } from "@/tools/ffmpeg/ffmpeg-client";

import { getCompressedVideoFilename, getCompressionCommand, getSizeReduction, getVideoCompressorError, largeVideoCompressorBytes, maxVideoCompressorBytes, resolutionOptions, type VideoQualityPreset, type VideoResolutionOption, videoCompressorAccept } from "./logic";

interface VideoProbe { readonly format?: { readonly duration?: string }; readonly streams?: readonly { readonly codec_type?: string; readonly width?: number; readonly height?: number }[]; }
interface VideoDimensions { readonly width: number; readonly height: number; }

function readText(data: Uint8Array | string) { return typeof data === "string" ? data : new TextDecoder().decode(data); }

function getError(error: unknown) {
  const detail = error instanceof Error ? error.message.toLowerCase() : "";
  if (detail.includes("abort") || detail.includes("terminated")) return "Compression was cancelled.";
  if (detail.includes("memory") || detail.includes("allocation")) return "Your browser ran out of memory while compressing this video. Try a shorter or smaller file.";
  return "This video could not be compressed locally. Try a different valid video file or a smaller file.";
}

export default function VideoCompressorWorkspace() {
  const [file, setFile] = useState<File>();
  const [preset, setPreset] = useState<VideoQualityPreset>("balanced");
  const [resolution, setResolution] = useState<VideoResolutionOption>("original");
  const [dimensions, setDimensions] = useState<VideoDimensions>();
  const [status, setStatus] = useState<FileToolStatus>("idle");
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState<number>();
  const [result, setResult] = useState<FileToolResult>();
  const engineRef = useRef<FfmpegEngine | undefined>(undefined);
  const jobIdRef = useRef(0);
  useEffect(() => () => engineRef.current?.terminate(), []);

  function clearAll() { jobIdRef.current += 1; engineRef.current?.terminate(); engineRef.current = undefined; setFile(undefined); setDimensions(undefined); setMessage(""); setProgress(undefined); setResult(undefined); setStatus("idle"); }
  function selectFiles(nextFiles: readonly File[]) { const next = nextFiles[0]; if (!next) { clearAll(); return; } const error = getVideoCompressorError(next); setFile(next); setDimensions(undefined); setResult(undefined); setProgress(undefined); setMessage(error ?? ""); setStatus(error ? "error" : "ready"); }

  async function compress() {
    if (!file || status === "processing") return;
    const id = ++jobIdRef.current; const inputPath = "input-video"; const probePath = "probe.json"; const outputPath = "compressed.mp4";
    let engine: FfmpegEngine | undefined; let duration: number | undefined;
    const onProgress = ({ progress: fraction, time }: { progress: number; time: number }) => { if (id !== jobIdRef.current || !duration) return; const value = time > 0 ? time / 1_000_000 / duration : fraction; if (Number.isFinite(value)) setProgress(Math.min(100, Math.max(0, Math.round(value * 100)))); };
    setStatus("processing"); setResult(undefined); setProgress(undefined); setMessage("Loading the local video engine…");
    try {
      engine = await createFfmpegEngine(); if (id !== jobIdRef.current) return; engineRef.current = engine;
      await engine.writeFile(inputPath, new Uint8Array(await file.arrayBuffer())); if (id !== jobIdRef.current) return;
      await engine.ffprobe(["-v", "error", "-show_entries", "format=duration:stream=codec_type,width,height", "-of", "json", "-o", probePath, inputPath]);
      const probe = JSON.parse(readText(await engine.readFile(probePath))) as VideoProbe;
      const video = probe.streams?.find((stream) => stream.codec_type === "video");
      if (!video?.width || !video.height) throw new Error("missing video stream");
      setDimensions({ width: video.width, height: video.height });
      const value = Number(probe.format?.duration); duration = Number.isFinite(value) && value > 0 ? value : undefined;
      engine.on("progress", onProgress); setMessage("Compressing locally in your browser…");
      if (await engine.exec(getCompressionCommand({ inputPath, outputPath, preset, resolution })) !== 0) throw new Error("compression failed");
      if (id !== jobIdRef.current) return;
      const data = await engine.readFile(outputPath); if (typeof data === "string") throw new Error("invalid output");
      const blob = new Blob([new Uint8Array(data)], { type: "video/mp4" }); const reduction = getSizeReduction(file.size, blob.size);
      setResult({ blob, filename: getCompressedVideoFilename(file.name), mimeType: "video/mp4", summary: reduction === undefined ? "Compressed locally." : reduction >= 0 ? `${reduction}% smaller than the source file.` : `${Math.abs(reduction)}% larger than the source file. Try the Smaller File preset.`, before: [{ label: "Source size", value: formatFileSize(file.size) }, { label: "Dimensions", value: `${video.width} × ${video.height} px` }], after: [{ label: "MP4 size", value: formatFileSize(blob.size) }, { label: "Change", value: reduction === undefined ? "Unavailable" : `${reduction}%` }] });
      setProgress(100); setMessage(""); setStatus("success");
    } catch (error) { if (id === jobIdRef.current) { setMessage(getError(error)); setStatus("error"); } }
    finally { if (engine) { engine.off("progress", onProgress); await Promise.allSettled([engine.deleteFile(inputPath), engine.deleteFile(probePath), engine.deleteFile(outputPath)]); engine.terminate(); } if (engineRef.current === engine) engineRef.current = undefined; }
  }
  function cancel() { jobIdRef.current += 1; engineRef.current?.terminate(); engineRef.current = undefined; setProgress(undefined); setMessage("Compression cancelled. Your selected video is still ready."); setStatus(file ? "ready" : "idle"); }
  const processing = status === "processing";
  return <div>
    <FilePicker accept={videoCompressorAccept} description="MP4, WebM, MKV, MOV, AVI, or M4V videos." disabled={processing} expectedOutput="A smaller MP4 video using your selected quality and resolution." files={file ? [file] : []} label="Choose a video or drop it here" maxSizeBytes={maxVideoCompressorBytes} onFilesChange={selectFiles} />
    <div className="mt-4"><ToolNotice title="Private by design" tone="info">Your video never leaves your device. Compression happens locally in your browser.</ToolNotice></div>
    {file && file.size >= largeVideoCompressorBytes ? <div className="mt-4"><ToolNotice title="Large video" tone="warning">Large videos can be slower and need more memory, especially on mobile devices. Keep this tab open while processing.</ToolNotice></div> : null}
    <ProcessingStatus message={processing && progress !== undefined ? `${message} ${progress}%` : message || undefined} status={status} />
    {file ? <section aria-labelledby="video-compressor-file" className="mt-6 rounded-card border border-line bg-panel-muted p-4"><h2 className="text-base font-bold text-ink" id="video-compressor-file">Compression settings</h2><dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2"><div><dt className="text-ink-subtle">File</dt><dd className="mt-0.5 break-all font-medium text-ink">{file.name}</dd></div><div><dt className="text-ink-subtle">Original size</dt><dd className="mt-0.5 font-medium text-ink">{formatFileSize(file.size)}</dd></div>{dimensions ? <div><dt className="text-ink-subtle">Dimensions</dt><dd className="mt-0.5 font-medium text-ink">{dimensions.width} × {dimensions.height} px</dd></div> : null}</dl><fieldset className="mt-5 grid gap-4 border-t border-line pt-4 sm:grid-cols-2"><legend className="sr-only">Video compression settings</legend><label className="block text-sm font-semibold text-ink">Quality preset<select className="mt-2 min-h-11 w-full rounded-control border border-line bg-canvas px-3 text-sm text-ink" disabled={processing} onChange={(event) => setPreset(event.target.value as VideoQualityPreset)} value={preset}><option value="smaller">Smaller File</option><option value="balanced">Balanced</option><option value="higher">Higher Quality</option></select></label><label className="block text-sm font-semibold text-ink">Maximum resolution<select className="mt-2 min-h-11 w-full rounded-control border border-line bg-canvas px-3 text-sm text-ink" disabled={processing} onChange={(event) => setResolution(event.target.value as VideoResolutionOption)} value={resolution}>{resolutionOptions.map((option) => <option key={option} value={option}>{option === "original" ? "Original" : `${option}p`}</option>)}</select><span className="mt-1 block text-xs font-normal leading-5 text-ink-subtle">Smaller videos are never enlarged.</span></label></fieldset><div className="mt-5 border-t border-line pt-4"><ToolActions label="Video compressor actions">{processing ? <ActionButton icon="x" onClick={cancel} tone="quiet">Cancel</ActionButton> : <><ActionButton icon="file" onClick={() => void compress()} tone="primary">Compress video</ActionButton><ClearButton onClear={clearAll} /></>}</ToolActions></div></section> : null}
    {result ? <FileResult analyticsKind="document" downloadTone="primary" onClear={clearAll} result={result} /> : null}
  </div>;
}
