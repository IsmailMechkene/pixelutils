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

import {
  assessMkvCompatibility,
  getMp4Filename,
  getMkvToMp4FileError,
  largeMkvToMp4Bytes,
  maxMkvToMp4Bytes,
  mkvToMp4Accept,
  type FfmpegProbeResult,
  type MkvCompatibility,
} from "./logic";

type ConversionMode = "copy" | "transcode";

function getConversionError(error: unknown) {
  const detail = error instanceof Error ? error.message.toLowerCase() : "";
  if (detail.includes("abort") || detail.includes("terminated")) return "Conversion was cancelled.";
  return "This MKV could not be converted in your browser. Try a smaller, valid file or a different video player/export.";
}

function textFromFfmpegData(data: Uint8Array | string) {
  return typeof data === "string" ? data : new TextDecoder().decode(data);
}

export default function MkvToMp4Workspace() {
  const [file, setFile] = useState<File>();
  const [status, setStatus] = useState<FileToolStatus>("idle");
  const [message, setMessage] = useState("");
  const [plan, setPlan] = useState<MkvCompatibility>();
  const [result, setResult] = useState<FileToolResult>();
  const [progress, setProgress] = useState<number>();
  const engineRef = useRef<FfmpegEngine | undefined>(undefined);
  const jobIdRef = useRef(0);

  useEffect(() => () => engineRef.current?.terminate(), []);

  function resetOutput() {
    setPlan(undefined);
    setResult(undefined);
    setProgress(undefined);
  }

  function clearAll() {
    jobIdRef.current += 1;
    engineRef.current?.terminate();
    engineRef.current = undefined;
    setFile(undefined);
    resetOutput();
    setMessage("");
    setStatus("idle");
  }

  function selectFile(nextFiles: readonly File[]) {
    const nextFile = nextFiles[0];
    if (!nextFile) {
      clearAll();
      return;
    }
    const error = getMkvToMp4FileError(nextFile);
    resetOutput();
    setFile(nextFile);
    setMessage(error ?? "");
    setStatus(error ? "error" : "ready");
  }

  async function run(mode: ConversionMode) {
    if (!file || status === "processing") return;
    const id = ++jobIdRef.current;
    const inputPath = "input.mkv";
    const probePath = "probe.json";
    const outputPath = "output.mp4";
    let engine: FfmpegEngine | undefined;
    let durationSeconds: number | undefined;
    let compatibility: MkvCompatibility | undefined;
    const onProgress = (event: { progress: number; time: number }) => {
      if (jobIdRef.current !== id || !durationSeconds) return;
      const derivedProgress = event.time > 0 ? event.time / 1_000_000 / durationSeconds : event.progress;
      if (Number.isFinite(derivedProgress)) setProgress(Math.min(100, Math.max(0, Math.round(derivedProgress * 100))));
    };

    setStatus("processing");
    setMessage(mode === "copy" ? "Loading the local video engine and checking stream compatibility…" : "Loading the local video engine and re-encoding this video…");
    setProgress(undefined);
    setResult(undefined);

    try {
      engine = await createFfmpegEngine();
      if (jobIdRef.current !== id) return;
      engineRef.current = engine;
      await engine.writeFile(inputPath, new Uint8Array(await file.arrayBuffer()));
      if (jobIdRef.current !== id) return;

      await engine.ffprobe(["-v", "error", "-show_entries", "format=duration:stream=codec_name,codec_type", "-of", "json", "-o", probePath, inputPath]);
      const probe = JSON.parse(textFromFfmpegData(await engine.readFile(probePath))) as FfmpegProbeResult;
      compatibility = assessMkvCompatibility(probe);
      durationSeconds = compatibility.durationSeconds;
      setPlan(compatibility);

      if (mode === "copy" && !compatibility.canStreamCopy) {
        setStatus("ready");
        setMessage(`${compatibility.reason} Re-encoding is available, but it will take longer and may change quality.`);
        return;
      }

      setMessage(mode === "copy" ? "Creating a quality-preserving MP4 copy locally…" : "Re-encoding locally for MP4 compatibility…");
      engine.on("progress", onProgress);
      const command = mode === "copy"
        ? ["-i", inputPath, "-map", "0:v:0", "-map", "0:a?", "-c", "copy", "-movflags", "+faststart", outputPath]
        : ["-i", inputPath, "-map", "0:v:0", "-map", "0:a?", "-c:v", "libx264", "-preset", "veryfast", "-crf", "28", "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart", outputPath];
      const exitCode = await engine.exec(command);
      if (exitCode !== 0) throw new Error("FFmpeg conversion failed");
      if (jobIdRef.current !== id) return;
      const bytes = await engine.readFile(outputPath);
      const blob = new Blob([typeof bytes === "string" ? bytes : new Uint8Array(bytes)], { type: "video/mp4" });
      setResult({
        blob,
        filename: getMp4Filename(file.name),
        mimeType: "video/mp4",
        summary: mode === "copy" ? "Compatible streams were copied without re-encoding." : "The video was re-encoded for MP4 compatibility.",
        before: [{ label: "Source", value: `${file.name} · ${formatFileSize(file.size)}` }],
        after: [{ label: "MP4 size", value: formatFileSize(blob.size) }],
      });
      setProgress(100);
      setStatus("success");
      setMessage("");
    } catch (error) {
      if (jobIdRef.current === id) {
        if (mode === "copy" && compatibility?.canStreamCopy) {
          setPlan({
            ...compatibility,
            canStreamCopy: false,
            reason: "A direct MP4 copy could not be created from these streams. Re-encoding is available as a separate fallback.",
          });
          setMessage("The quality-preserving copy was not possible. Re-encoding is available, but it may take longer and change quality.");
          setStatus("ready");
          return;
        }
        setMessage(getConversionError(error));
        setStatus("error");
      }
    } finally {
      if (engine) {
        engine.off("progress", onProgress);
        await Promise.allSettled([engine.deleteFile(inputPath), engine.deleteFile(probePath), engine.deleteFile(outputPath)]);
        engine.terminate();
      }
      if (engineRef.current === engine) engineRef.current = undefined;
    }
  }

  function cancel() {
    jobIdRef.current += 1;
    engineRef.current?.terminate();
    engineRef.current = undefined;
    setProgress(undefined);
    setStatus(file ? "ready" : "idle");
    setMessage("Conversion cancelled. Your selected file is still ready.");
  }

  const isProcessing = status === "processing";
  const showLargeWarning = Boolean(file && file.size >= largeMkvToMp4Bytes);

  return (
    <div>
      <FilePicker accept={mkvToMp4Accept} description="MKV videos." disabled={isProcessing} expectedOutput="An MP4 that preserves compatible streams when possible; otherwise, you can choose re-encoding." files={file ? [file] : []} label="Choose an MKV video or drop it here" maxSizeBytes={maxMkvToMp4Bytes} onFilesChange={selectFile} />
      <div className="mt-4"><ToolNotice title="Private by design" tone="info">Your video never leaves your device. Processing happens locally in your browser after you start it.</ToolNotice></div>
      {showLargeWarning ? <div className="mt-4"><ToolNotice title="Large video" tone="warning">This file may take time and needs substantial browser memory. Keep this tab open and avoid starting other heavy tasks.</ToolNotice></div> : null}
      <ProcessingStatus message={isProcessing && progress !== undefined ? `${message} ${progress}%` : message || undefined} status={status} />
      {file ? <section aria-labelledby="mkv-file-title" className="mt-6 rounded-card border border-line bg-panel-muted p-4"><h2 className="text-base font-bold text-ink" id="mkv-file-title">Selected MKV</h2><dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2"><div><dt className="text-ink-subtle">File</dt><dd className="mt-0.5 break-all font-medium text-ink">{file.name}</dd></div><div><dt className="text-ink-subtle">Size</dt><dd className="mt-0.5 font-medium text-ink">{formatFileSize(file.size)}</dd></div></dl>{plan ? <p className="mt-4 text-sm leading-6 text-ink-muted">{plan.reason}</p> : null}<div className="mt-4 border-t border-line pt-4"><ToolActions label="MKV to MP4 actions">{isProcessing ? <ActionButton icon="x" onClick={cancel} tone="quiet">Cancel</ActionButton> : <><ActionButton icon="file" onClick={() => void run("copy")} tone="primary">Create MP4</ActionButton>{plan && !plan.canStreamCopy ? <ActionButton icon="settings-2" onClick={() => void run("transcode")}>Re-encode for MP4</ActionButton> : null}<ClearButton onClear={clearAll} /></>}</ToolActions></div></section> : null}
      {result ? <FileResult analyticsKind="document" downloadTone="primary" onClear={clearAll} result={result} /> : null}
    </div>
  );
}
