"use client";

/* eslint-disable @next/next/no-img-element -- previews use local object URLs only. */

import { useEffect, useRef, useState } from "react";

import { ActionButton } from "@/components/tool-shell/action-button";
import { ClearButton } from "@/components/tool-shell/clear-button";
import { ToolActions } from "@/components/tool-shell/tool-actions";
import { ToolNotice } from "@/components/tool-shell/tool-notice";
import {
  FilePicker,
  FileResult,
  ProcessingStatus,
} from "@/components/file-tools";
import { CustomColorInput } from "@/components/ui/custom-color-input";
import { CustomSelect } from "@/components/ui/custom-select";
import { formatFileSize } from "@/lib/file-tools/format";
import { createObjectUrlHandle } from "@/lib/file-tools/object-url";
import type { FileToolResult, FileToolStatus } from "@/lib/file-tools/types";
import { recordToolHistory } from "@/lib/storage/tool-activity";

import {
  getSupportedImageMime,
  imageCompressorAccept,
  maxImageCompressorBytes,
  type SupportedImageMime,
} from "../image-compressor/logic";
import {
  getAvailableOutputFormats,
  getConvertedFilename,
  getImageConverterPreset,
  getInitialOutputFormat,
  getOutputFormatDescription,
  imageFormatLabels,
  isPresetCompatible,
  type ImageConverterPreset,
} from "./logic";

type WorkerMessage =
  | { type: "inspected"; id: number; width: number; height: number }
  | { type: "result"; id: number; blob: Blob }
  | { type: "error"; id: number; message: string };

interface ImageDetails {
  readonly width: number;
  readonly height: number;
  readonly mimeType: SupportedImageMime;
}

export function ImageConverterWorkspace({
  slug,
  preset,
}: {
  slug: string;
  preset?: ImageConverterPreset;
}) {
  const [file, setFile] = useState<File>();
  const [details, setDetails] = useState<ImageDetails>();
  const [outputType, setOutputType] = useState<SupportedImageMime>();
  const [quality, setQuality] = useState(82);
  const [background, setBackground] = useState("#ffffff");
  const [originalUrl, setOriginalUrl] = useState<string>();
  const [outputUrl, setOutputUrl] = useState<string>();
  const [result, setResult] = useState<FileToolResult>();
  const [status, setStatus] = useState<FileToolStatus>("idle");
  const [error, setError] = useState("");
  const sourceUrl = useRef(createObjectUrlHandle());
  const resultUrl = useRef(createObjectUrlHandle());
  const workerRef = useRef<Worker | undefined>(undefined);
  const requestId = useRef(0);

  useEffect(
    () => () => {
      workerRef.current?.terminate();
      sourceUrl.current.dispose();
      resultUrl.current.dispose();
    },
    [],
  );

  function clearResult() {
    resultUrl.current.replace();
    setOutputUrl(undefined);
    setResult(undefined);
  }
  function clearAll() {
    requestId.current += 1;
    workerRef.current?.terminate();
    workerRef.current = undefined;
    sourceUrl.current.replace();
    resultUrl.current.replace();
    setFile(undefined);
    setDetails(undefined);
    setOutputType(undefined);
    setOriginalUrl(undefined);
    setOutputUrl(undefined);
    setResult(undefined);
    setError("");
    setStatus("idle");
  }

  function selectFile(files: readonly File[]) {
    if (!files.length) return clearAll();
    const [nextFile] = files;
    const mimeType = getSupportedImageMime(nextFile);
    requestId.current += 1;
    const id = requestId.current;
    workerRef.current?.terminate();
    workerRef.current = undefined;
    sourceUrl.current.replace();
    clearResult();
    setFile(nextFile);
    setDetails(undefined);
    setOutputType(undefined);
    setOriginalUrl(undefined);
    setError("");
    setStatus("processing");
    if (!mimeType) {
      setStatus("error");
      setError("Choose a PNG, JPG, JPEG, or WebP image.");
      return;
    }
    if (!isPresetCompatible(mimeType, preset)) {
      setStatus("error");
      setError("This preset accepts a different image format.");
      return;
    }
    try {
      const worker = new Worker(
        new URL("./image-converter.worker.ts", import.meta.url),
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
        setDetails({ width: message.width, height: message.height, mimeType });
        setOutputType(getInitialOutputFormat(mimeType, preset));
        setOriginalUrl(sourceUrl.current.replace(nextFile));
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

  function convert() {
    if (!file || !details || !outputType || status === "processing") return;
    clearResult();
    setError("");
    setStatus("processing");
    requestId.current += 1;
    const id = requestId.current;
    try {
      const worker = new Worker(
        new URL("./image-converter.worker.ts", import.meta.url),
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
        setOutputUrl(resultUrl.current.replace(message.blob));
        setResult({
          blob: message.blob,
          filename: getConvertedFilename(file.name, outputType),
          mimeType: outputType,
          summary: `${imageFormatLabels[details.mimeType]} converted to ${imageFormatLabels[outputType]}.`,
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
              value: `${details.width} × ${details.height} px`,
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
          setError(
            "The image converter stopped unexpectedly. Please try again.",
          );
          setStatus("error");
        }
      };
      worker.postMessage({
        type: "convert",
        id,
        file,
        outputType,
        quality,
        background,
      });
    } catch {
      setError(
        "This browser cannot start local image conversion. Try a current browser.",
      );
      setStatus("error");
    }
  }

  const outputOptions = details
    ? getAvailableOutputFormats(details.mimeType).map((value) => ({
        value,
        label: imageFormatLabels[value],
      }))
    : [];
  const isLossy = outputType === "image/jpeg" || outputType === "image/webp";
  const acceptedInput = preset?.input ?? imageCompressorAccept;
  function cancel() {
    requestId.current += 1;
    workerRef.current?.terminate();
    workerRef.current = undefined;
    setStatus(details ? "ready" : "idle");
  }

  return (
    <div>
      <FilePicker
        accept={acceptedInput}
        description="PNG, JPG, JPEG, or WebP up to 25 MB."
        disabled={status === "processing"}
        files={file ? [file] : []}
        label="Choose an image or drop it here"
        maxSizeBytes={maxImageCompressorBytes}
        onFilesChange={selectFile}
      />
      <div className="mt-4">
        <ToolNotice title="Metadata" tone="info">
          Re-encoding may remove optional metadata, such as camera details and
          location.
        </ToolNotice>
      </div>
      <ProcessingStatus message={error || undefined} status={status} />
      {file && details && originalUrl && outputType ? (
        <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_17rem]">
          <section aria-labelledby="converter-source-title">
            <div className="flex items-baseline justify-between gap-3">
              <h2
                className="text-base font-bold text-ink"
                id="converter-source-title"
              >
                Source image
              </h2>
              <p className="text-xs text-ink-subtle">
                {details.width} × {details.height} px ·{" "}
                {formatFileSize(file.size)}
              </p>
            </div>
            <div className="mt-3 flex min-h-56 items-center justify-center overflow-hidden rounded-card border border-line-strong bg-canvas p-3 sm:min-h-72">
              <img
                alt={`Source preview of ${file.name}`}
                className="max-h-96 max-w-full object-contain"
                src={originalUrl}
              />
            </div>
          </section>
          <section
            aria-labelledby="converter-settings-title"
            className="rounded-card border border-line bg-panel-muted p-4"
          >
            <h2
              className="text-base font-bold text-ink"
              id="converter-settings-title"
            >
              Convert to
            </h2>
            <div className="mt-4">
              <CustomSelect
                disabled={Boolean(preset?.output)}
                description={
                  preset?.output
                    ? "This conversion format is fixed for this page."
                    : undefined
                }
                id="image-output-format"
                label="Output format"
                onChange={(value) => {
                  setOutputType(value as SupportedImageMime);
                  clearResult();
                  if (status === "success") setStatus("ready");
                }}
                options={outputOptions}
                value={outputType}
              />
            </div>
            <p className="mt-3 text-sm leading-6 text-ink-muted">
              {getOutputFormatDescription(outputType)}
            </p>
            {isLossy ? (
              <label
                className="mt-4 block text-sm font-semibold text-ink"
                htmlFor="converter-quality"
              >
                Quality{" "}
                <output className="float-right font-mono text-ink-muted">
                  {quality}
                </output>
                <input
                  aria-describedby="converter-quality-help"
                  className="mt-3 w-full accent-accent"
                  id="converter-quality"
                  max="100"
                  min="40"
                  onChange={(event) => {
                    setQuality(event.target.valueAsNumber);
                    clearResult();
                    if (status === "success") setStatus("ready");
                  }}
                  type="range"
                  value={quality}
                />
                <span
                  className="mt-2 block text-xs font-normal leading-5 text-ink-subtle"
                  id="converter-quality-help"
                >
                  Lower quality usually makes JPG and WebP files smaller.
                </span>
              </label>
            ) : null}
            {outputType === "image/jpeg" ? (
              <div className="mt-4">
                <CustomColorInput
                  id="jpg-background"
                  label="JPG background"
                  onChange={setBackground}
                  value={background}
                />
              </div>
            ) : null}
            <div className="mt-5 border-t border-line pt-4">
              <ToolActions label="Image conversion actions">
                {status === "processing" ? (
                  <ActionButton icon="x" onClick={cancel} tone="quiet">
                    Cancel
                  </ActionButton>
                ) : (
                  <ActionButton
                    icon="refresh-cw"
                    onClick={convert}
                    tone="primary"
                  >
                    Convert image
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
          {outputUrl ? (
            <section aria-labelledby="converter-output-title" className="mt-6">
              <h2
                className="text-base font-bold text-ink"
                id="converter-output-title"
              >
                Converted preview
              </h2>
              <div className="mt-3 flex min-h-56 items-center justify-center overflow-hidden rounded-card border border-line-strong bg-canvas p-3 sm:min-h-72">
                <img
                  alt="Converted preview"
                  className="max-h-96 max-w-full object-contain"
                  src={outputUrl}
                />
              </div>
            </section>
          ) : null}
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

export default function Workspace({ slug }: { slug: string }) {
  return (
    <ImageConverterWorkspace
      preset={getImageConverterPreset(slug)}
      slug={slug}
    />
  );
}
