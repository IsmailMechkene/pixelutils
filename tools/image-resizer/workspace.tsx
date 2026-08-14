"use client";

/* eslint-disable @next/next/no-img-element -- previews use local object URLs only. */

import { useEffect, useRef, useState } from "react";

import { ActionButton } from "@/components/tool-shell/action-button";
import { ClearButton } from "@/components/tool-shell/clear-button";
import { ToolActions } from "@/components/tool-shell/tool-actions";
import { ToolNotice } from "@/components/tool-shell/tool-notice";
import { FilePicker, FileResult, ProcessingStatus } from "@/components/file-tools";
import { CustomColorInput } from "@/components/ui/custom-color-input";
import { CustomSelect } from "@/components/ui/custom-select";
import { formatFileSize } from "@/lib/file-tools/format";
import { createObjectUrlHandle } from "@/lib/file-tools/object-url";
import type { FileToolResult, FileToolStatus } from "@/lib/file-tools/types";
import { recordToolHistory } from "@/lib/storage/tool-activity";

import {
  getAvailableOutputFormats,
  imageFormatLabels,
} from "../image-converter/logic";
import {
  getSupportedImageMime,
  imageCompressorAccept,
  maxImageCompressorBytes,
  type SupportedImageMime,
} from "../image-compressor/logic";
import {
  getAspectHeight,
  getAspectWidth,
  isUpscaling,
  validateResizeDimensions,
} from "./logic";

type WorkerMessage =
  | { type: "inspected"; id: number; width: number; height: number }
  | { type: "result"; id: number; blob: Blob }
  | { type: "error"; id: number; message: string };
type Details = { width: number; height: number; mimeType: SupportedImageMime };

function outputFilename(filename: string, mimeType: SupportedImageMime) {
  const stem = filename.replace(/\.[^.]+$/, "") || "image";
  return `${stem}-resized.${mimeType === "image/jpeg" ? "jpg" : mimeType.slice(6)}`;
}

export default function Workspace({ slug }: { slug: string }) {
  const [file, setFile] = useState<File>();
  const [details, setDetails] = useState<Details>();
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [locked, setLocked] = useState(true);
  const [outputType, setOutputType] = useState<SupportedImageMime>();
  const [quality, setQuality] = useState(82);
  const [background, setBackground] = useState("#ffffff");
  const [sourceUrl, setSourceUrl] = useState<string>();
  const [outputUrl, setOutputUrl] = useState<string>();
  const [result, setResult] = useState<FileToolResult>();
  const [status, setStatus] = useState<FileToolStatus>("idle");
  const [error, setError] = useState("");
  const sourceHandle = useRef(createObjectUrlHandle());
  const outputHandle = useRef(createObjectUrlHandle());
  const workerRef = useRef<Worker | undefined>(undefined);
  const requestId = useRef(0);
  useEffect(
    () => () => {
      workerRef.current?.terminate();
      sourceHandle.current.dispose();
      outputHandle.current.dispose();
    },
    [],
  );
  function clearResult() {
    outputHandle.current.replace();
    setOutputUrl(undefined);
    setResult(undefined);
  }
  function clearAll() {
    requestId.current += 1;
    workerRef.current?.terminate();
    workerRef.current = undefined;
    sourceHandle.current.replace();
    outputHandle.current.replace();
    setFile(undefined);
    setDetails(undefined);
    setWidth("");
    setHeight("");
    setOutputType(undefined);
    setSourceUrl(undefined);
    setOutputUrl(undefined);
    setResult(undefined);
    setError("");
    setStatus("idle");
  }
  function inspect(files: readonly File[]) {
    if (!files.length) return clearAll();
    const [nextFile] = files;
    const mimeType = getSupportedImageMime(nextFile);
    requestId.current += 1;
    const id = requestId.current;
    workerRef.current?.terminate();
    sourceHandle.current.replace();
    clearResult();
    setFile(nextFile);
    setDetails(undefined);
    setSourceUrl(undefined);
    setError("");
    setStatus("processing");
    if (!mimeType) {
      setError("Choose a PNG, JPG, JPEG, or WebP image.");
      setStatus("error");
      return;
    }
    try {
      const worker = new Worker(
        new URL(
          "../image-converter/image-converter.worker.ts",
          import.meta.url,
        ),
      );
      workerRef.current = worker;
      worker.onmessage = (event: MessageEvent<WorkerMessage>) => {
        const message = event.data;
        if (message.id !== id || workerRef.current !== worker) return;
        worker.terminate();
        workerRef.current = undefined;
        if (message.type === "error") {
          setError(message.message);
          setStatus("error");
          return;
        }
        if (message.type !== "inspected") return;
        const next = { width: message.width, height: message.height, mimeType };
        setDetails(next);
        setWidth(String(next.width));
        setHeight(String(next.height));
        setOutputType(mimeType);
        setSourceUrl(sourceHandle.current.replace(nextFile));
        setStatus("ready");
      };
      worker.onerror = () => {
        if (workerRef.current === worker) {
          worker.terminate();
          workerRef.current = undefined;
          setError("The image could not be inspected. Please try again.");
          setStatus("error");
        }
      };
      worker.postMessage({ type: "inspect", id, file: nextFile, mimeType });
    } catch {
      setError(
        "This browser cannot inspect images locally. Try a current browser.",
      );
      setStatus("error");
    }
  }
  function resize() {
    if (!file || !details || !outputType) return;
    const target = { width: Number(width), height: Number(height) };
    const validation = validateResizeDimensions(target.width, target.height);
    if (validation) {
      setError(validation);
      setStatus("error");
      return;
    }
    clearResult();
    setError("");
    setStatus("processing");
    requestId.current += 1;
    const id = requestId.current;
    try {
      const worker = new Worker(
        new URL(
          "../image-converter/image-converter.worker.ts",
          import.meta.url,
        ),
      );
      workerRef.current = worker;
      worker.onmessage = (event: MessageEvent<WorkerMessage>) => {
        const message = event.data;
        if (message.id !== id || workerRef.current !== worker) return;
        worker.terminate();
        workerRef.current = undefined;
        if (message.type === "error") {
          setError(message.message);
          setStatus("error");
          return;
        }
        if (message.type !== "result") return;
        setOutputUrl(outputHandle.current.replace(message.blob));
        setResult({
          blob: message.blob,
          filename: outputFilename(file.name, outputType),
          mimeType: outputType,
          summary: `Resized to ${target.width} × ${target.height} px.`,
          before: [
            {
              label: "Dimensions",
              value: `${details.width} × ${details.height} px`,
            },
            { label: "File size", value: formatFileSize(file.size) },
          ],
          after: [
            {
              label: "Dimensions",
              value: `${target.width} × ${target.height} px`,
            },
            { label: "File size", value: formatFileSize(message.blob.size) },
          ],
        });
        setStatus("success");
        recordToolHistory(slug, "processed", { sensitive: false });
      };
      worker.onerror = () => {
        if (workerRef.current === worker) {
          worker.terminate();
          workerRef.current = undefined;
          setError("The image resizer stopped unexpectedly. Please try again.");
          setStatus("error");
        }
      };
      worker.postMessage({
        type: "resize",
        id,
        file,
        outputType,
        quality,
        background,
        width: target.width,
        height: target.height,
      });
    } catch {
      setError(
        "This browser cannot start local image resizing. Try a current browser.",
      );
      setStatus("error");
    }
  }
  const target = { width: Number(width), height: Number(height) };
  const upscale =
    details &&
    Number.isFinite(target.width) &&
    Number.isFinite(target.height) &&
    isUpscaling(target, details);
  const options = details
    ? [details.mimeType, ...getAvailableOutputFormats(details.mimeType)].map(
        (value) => ({
          value,
          label:
            value === details.mimeType
              ? `Keep ${imageFormatLabels[value]}`
              : imageFormatLabels[value],
        }),
      )
    : [];
  const lossy = outputType === "image/jpeg" || outputType === "image/webp";
  return (
    <div>
      <FilePicker
        accept={imageCompressorAccept}
        description="PNG, JPG, JPEG, or WebP images."
        disabled={status === "processing"}
        files={file ? [file] : []}
        label="Choose an image or drop it here"
        maxSizeBytes={maxImageCompressorBytes}
        onFilesChange={inspect}
        expectedOutput="A resized image in your selected format."
      />
      <div className="mt-4">
        <ToolNotice title="Metadata" tone="info">
          Re-encoding may remove optional metadata, such as camera details and
          location.
        </ToolNotice>
      </div>
      <ProcessingStatus message={error || undefined} status={status} />
      {file && details && sourceUrl && outputType ? (
        <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_17rem]">
          <section aria-labelledby="resize-source-title">
            <h2
              className="text-base font-bold text-ink"
              id="resize-source-title"
            >
              Original image
            </h2>
            <p className="mt-1 text-xs text-ink-subtle">
              {details.width} × {details.height} px ·{" "}
              {formatFileSize(file.size)}
            </p>
            <div className="mt-3 flex min-h-56 items-center justify-center overflow-hidden rounded-card border border-line-strong bg-canvas p-3 sm:min-h-72">
              <img
                alt={`Original preview of ${file.name}`}
                className="max-h-96 max-w-full object-contain"
                src={sourceUrl}
              />
            </div>
          </section>
          <section
            aria-labelledby="resize-settings-title"
            className="rounded-card border border-line bg-panel-muted p-4"
          >
            <h2
              className="text-base font-bold text-ink"
              id="resize-settings-title"
            >
              Resize
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <label className="text-sm font-semibold">
                Width
                <input
                  className="mt-2 min-h-11 w-full rounded-control border border-line-strong bg-canvas px-3"
                  inputMode="numeric"
                  min="1"
                  onChange={(event) => {
                    const next = event.target.value;
                    setWidth(next);
                    if (locked && details && Number(next) > 0)
                      setHeight(String(getAspectHeight(Number(next), details)));
                    clearResult();
                  }}
                  type="number"
                  value={width}
                />
              </label>
              <label className="text-sm font-semibold">
                Height
                <input
                  className="mt-2 min-h-11 w-full rounded-control border border-line-strong bg-canvas px-3"
                  inputMode="numeric"
                  min="1"
                  onChange={(event) => {
                    const next = event.target.value;
                    setHeight(next);
                    if (locked && details && Number(next) > 0)
                      setWidth(String(getAspectWidth(Number(next), details)));
                    clearResult();
                  }}
                  type="number"
                  value={height}
                />
              </label>
            </div>
            <label className="mt-4 flex min-h-11 items-center gap-3 text-sm font-semibold">
              <input
                checked={locked}
                className="size-4 accent-accent"
                onChange={(event) => setLocked(event.target.checked)}
                type="checkbox"
              />
              Lock aspect ratio
            </label>
            {upscale ? (
              <p className="mt-3 text-sm leading-6 text-warning">
                This will upscale the image and may reduce visual quality.
              </p>
            ) : null}
            <div className="mt-4">
              <CustomSelect
                id="resize-output-format"
                label="Output format"
                onChange={(value) => {
                  setOutputType(value as SupportedImageMime);
                  clearResult();
                }}
                options={options}
                value={outputType}
              />
            </div>
            {lossy ? (
              <label className="mt-4 block text-sm font-semibold">
                Quality{" "}
                <output className="float-right font-mono text-ink-muted">
                  {quality}
                </output>
                <input
                  className="mt-3 w-full accent-accent"
                  max="100"
                  min="40"
                  onChange={(event) => {
                    setQuality(event.target.valueAsNumber);
                    clearResult();
                  }}
                  type="range"
                  value={quality}
                />
              </label>
            ) : null}
            {outputType === "image/jpeg" ? (
              <div className="mt-4">
                <CustomColorInput
                  id="resize-jpg-background"
                  label="JPG background"
                  onChange={setBackground}
                  value={background}
                />
              </div>
            ) : null}
            <div className="mt-5 border-t border-line pt-4">
              <ToolActions label="Resize actions">
                {status === "processing" ? (
                  <ActionButton
                    icon="x"
                    onClick={() => {
                      requestId.current += 1;
                      workerRef.current?.terminate();
                      workerRef.current = undefined;
                      setStatus("ready");
                    }}
                    tone="quiet"
                  >
                    Cancel
                  </ActionButton>
                ) : (
                  <ActionButton
                    icon="refresh-cw"
                    onClick={resize}
                    tone="primary"
                  >
                    Resize image
                  </ActionButton>
                )}
                <ClearButton disabled={!file} onClear={clearAll} />
              </ToolActions>
            </div>
          </section>
        </div>
      ) : null}
      {result ? (
        <>
          <section aria-labelledby="resized-preview-title" className="mt-6">
            {outputUrl ? (
              <>
                <h2
                  className="text-base font-bold text-ink"
                  id="resized-preview-title"
                >
                  Resized preview
                </h2>
                <div className="mt-3 flex min-h-56 items-center justify-center overflow-hidden rounded-card border border-line-strong bg-canvas p-3 sm:min-h-72">
                  <img
                    alt="Resized preview"
                    className="max-h-96 max-w-full object-contain"
                    src={outputUrl}
                  />
                </div>
              </>
            ) : null}
          </section>
          <FileResult
            analyticsKind="image"
            downloadTone="primary"
            onClear={clearAll}
            onDownloaded={() =>
              recordToolHistory(slug, "downloaded", { sensitive: false })
            }
            result={result}
          />
        </>
      ) : null}
    </div>
  );
}
