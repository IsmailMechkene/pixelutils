"use client";

import { useEffect, useRef, useState } from "react";

import { FilePicker, ProcessingStatus } from "@/components/file-tools";
import { ActionButton } from "@/components/tool-shell/action-button";
import { ClearButton } from "@/components/tool-shell/clear-button";
import { DownloadButton } from "@/components/tool-shell/download-button";
import { ToolActions } from "@/components/tool-shell/tool-actions";
import { ToolNotice } from "@/components/tool-shell/tool-notice";
import { formatFileSize } from "@/lib/file-tools/format";
import type { FileToolStatus } from "@/lib/file-tools/types";

import { createFfmpegPrototypeEngine, type FfmpegPrototypeEngine } from "./ffmpeg-client";
import { ffmpegPrototypeAccept, getPrototypeVideoError, maxFfmpegPrototypeBytes } from "./logic";

interface VideoInfo { readonly duration: number; readonly height: number; readonly width: number; }
interface Output { readonly blob: Blob; readonly filename: string; }

async function inspectVideo(file: File): Promise<VideoInfo> {
  const url = URL.createObjectURL(file);
  try {
    return await new Promise<VideoInfo>((resolve, reject) => {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => resolve({ duration: video.duration, height: video.videoHeight, width: video.videoWidth });
      video.onerror = () => reject(new Error("This video could not be read by your browser."));
      video.src = url;
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

function deleteVirtualFile(engine: FfmpegPrototypeEngine, path: string) {
  return engine.deleteFile(path).catch(() => undefined);
}

export default function FfmpegPrototypeWorkspace() {
  const [file, setFile] = useState<File>();
  const [videoInfo, setVideoInfo] = useState<VideoInfo>();
  const [output, setOutput] = useState<Output>();
  const [status, setStatus] = useState<FileToolStatus>("idle");
  const [phase, setPhase] = useState("");
  const [progress, setProgress] = useState<number>();
  const [error, setError] = useState("");
  const engineRef = useRef<FfmpegPrototypeEngine | undefined>(undefined);
  const cancelledRef = useRef(false);

  useEffect(() => () => engineRef.current?.terminate(), []);

  function clearAll() {
    cancelledRef.current = true;
    engineRef.current?.terminate();
    engineRef.current = undefined;
    setFile(undefined); setVideoInfo(undefined); setOutput(undefined); setStatus("idle"); setPhase(""); setProgress(undefined); setError("");
  }

  async function selectFiles(nextFiles: readonly File[]) {
    const nextFile = nextFiles[0];
    if (!nextFile) { clearAll(); return; }
    const fileError = getPrototypeVideoError(nextFile);
    if (fileError) { setFile(undefined); setVideoInfo(undefined); setOutput(undefined); setStatus("error"); setError(fileError); return; }

    setFile(nextFile); setVideoInfo(undefined); setOutput(undefined); setError(""); setPhase("Reading local video metadata..."); setStatus("processing");
    try {
      const details = await inspectVideo(nextFile);
      setVideoInfo(details); setPhase(""); setStatus("ready");
    } catch (inspectionError) {
      setPhase(""); setStatus("error"); setError(inspectionError instanceof Error ? inspectionError.message : "This video could not be read.");
    }
  }

  async function runFfmpegJob({
    args,
    input,
    successMessage,
  }: {
    readonly args: readonly string[];
    readonly input?: File;
    readonly successMessage: string;
  }) {
    if (status === "processing") return;
    const inputPath = "input-video";
    const outputPath = "preview.webm";
    let engine: FfmpegPrototypeEngine | undefined;
    let onProgress: ((event: { progress: number }) => void) | undefined;

    cancelledRef.current = false;
    setOutput(undefined); setError(""); setProgress(0); setPhase("Loading FFmpeg locally..."); setStatus("processing");
    try {
      engine = await createFfmpegPrototypeEngine();
      engineRef.current = engine;
      if (cancelledRef.current) return;
      onProgress = ({ progress: nextProgress }) => {
        if (!cancelledRef.current && Number.isFinite(nextProgress)) setProgress(Math.max(0, Math.min(1, nextProgress)));
      };
      engine.on("progress", onProgress);
      if (input) {
        setPhase("Copying the selected video into local FFmpeg memory...");
        await engine.writeFile(inputPath, new Uint8Array(await input.arrayBuffer()));
        if (cancelledRef.current) return;
      }
      setPhase(successMessage);
      const exitCode = await engine.exec([...args], 45_000);
      if (cancelledRef.current) return;
      if (exitCode !== 0) throw new Error("FFmpeg could not create a preview from this video.");
      setPhase("Preparing the local download...");
      const data = await engine.readFile(outputPath);
      if (typeof data === "string") throw new Error("FFmpeg returned an invalid preview file.");
      setOutput({ blob: new Blob([new Uint8Array(data)], { type: "video/webm" }), filename: "ffmpeg-preview.webm" });
      setProgress(1); setPhase(""); setStatus("success");
    } catch (processingError) {
      if (!cancelledRef.current) {
        const message = processingError instanceof Error
          ? processingError.message
          : typeof processingError === "string"
            ? processingError
            : "FFmpeg stopped before the preview could be created.";
        setPhase(""); setProgress(undefined); setStatus("error"); setError(message);
      }
    } finally {
      if (engine && onProgress) engine.off("progress", onProgress);
      if (engine) { await Promise.all([deleteVirtualFile(engine, inputPath), deleteVirtualFile(engine, outputPath)]); engine.terminate(); }
      if (engineRef.current === engine) engineRef.current = undefined;
    }
  }

  function createPreview() {
    if (!file || !videoInfo) return;
    void runFfmpegJob({
      args: ["-i", "input-video", "-t", "1", "-map", "0:v:0", "-an", "-c:v", "libvpx-vp9", "-b:v", "800k", "preview.webm"],
      input: file,
      successMessage: "Creating a one-second WebM preview locally...",
    });
  }

  function runSelfCheck() {
    void runFfmpegJob({
      args: ["-f", "lavfi", "-i", "color=c=black:s=64x64:d=1", "-c:v", "libvpx-vp9", "-b:v", "80k", "preview.webm"],
      successMessage: "Creating a one-second local FFmpeg self-check video...",
    });
  }

  function cancel() {
    cancelledRef.current = true; engineRef.current?.terminate(); engineRef.current = undefined; setPhase(""); setProgress(undefined); setStatus(videoInfo ? "ready" : "idle");
  }

  const isProcessing = status === "processing";
  return <div>
    <FilePicker accept={ffmpegPrototypeAccept} description="MP4 or WebM only, up to 10 MB. This is intentionally limited for a safe engine check." disabled={isProcessing} files={file ? [file] : []} label="Choose a small test video or drop it here" maxSizeBytes={maxFfmpegPrototypeBytes} onFilesChange={selectFiles} />
    <div className="mt-4"><ToolNotice title="Local-only test" tone="info">The selected video, temporary FFmpeg files, and output remain in this browser. The FFmpeg worker is terminated after each run.</ToolNotice></div>
    <ProcessingStatus message={error || phase || undefined} status={status} />
    {progress !== undefined ? <div aria-live="polite" className="mt-4"><div className="flex justify-between gap-3 text-xs text-ink-subtle"><span>{phase || "Processing locally"}</span><span>{Math.round(progress * 100)}%</span></div><progress aria-label="FFmpeg processing progress" className="mt-2 h-2 w-full accent-accent" max="1" value={progress} /></div> : null}
    {!file ? <div className="mt-5"><ToolActions label="FFmpeg self-check actions">{isProcessing ? <ActionButton icon="x" onClick={cancel} tone="quiet">Cancel</ActionButton> : <ActionButton icon="file" onClick={runSelfCheck} tone="primary">Run engine self-check</ActionButton>}</ToolActions></div> : null}
    {file && videoInfo ? <section aria-labelledby="ffmpeg-prototype-file" className="mt-6 rounded-card border border-line bg-panel-muted p-4"><h2 className="text-base font-bold text-ink" id="ffmpeg-prototype-file">Selected test video</h2><dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2"><div><dt className="text-ink-subtle">File</dt><dd className="mt-0.5 break-all font-medium text-ink">{file.name}</dd></div><div><dt className="text-ink-subtle">Size</dt><dd className="mt-0.5 font-medium text-ink">{formatFileSize(file.size)}</dd></div><div><dt className="text-ink-subtle">Dimensions</dt><dd className="mt-0.5 font-medium text-ink">{videoInfo.width} × {videoInfo.height}</dd></div><div><dt className="text-ink-subtle">Duration</dt><dd className="mt-0.5 font-medium text-ink">{videoInfo.duration.toFixed(1)} seconds</dd></div></dl><p className="mt-4 text-sm leading-6 text-ink-muted">The test creates a silent, one-second WebM preview. It is intentionally not a production conversion feature.</p><div className="mt-4 border-t border-line pt-4"><ToolActions label="FFmpeg prototype actions">{isProcessing ? <ActionButton icon="x" onClick={cancel} tone="quiet">Cancel</ActionButton> : <ActionButton icon="file" onClick={createPreview} tone="primary">Run FFmpeg test</ActionButton>}<ClearButton disabled={isProcessing} onClear={clearAll} /></ToolActions></div></section> : null}
    {output ? <section aria-labelledby="ffmpeg-prototype-result" className="mt-6 rounded-card border border-success/30 bg-success-soft p-4"><h2 className="text-base font-bold text-success" id="ffmpeg-prototype-result">FFmpeg output ready</h2><p className="mt-1 text-sm text-ink-muted">{formatFileSize(output.blob.size)} WebM file created locally.</p><div className="mt-4"><DownloadButton analyticsKind="document" data={output.blob} filename={output.filename} label="Download test output" mimeType="video/webm" tone="primary" /></div></section> : null}
  </div>;
}
