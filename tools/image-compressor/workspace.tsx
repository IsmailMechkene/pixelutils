"use client";

/* eslint-disable @next/next/no-img-element -- Both previews are generated local object URLs. */

import { useEffect, useRef, useState } from "react";

import { ActionButton } from "@/components/tool-shell/action-button";
import { ClearButton } from "@/components/tool-shell/clear-button";
import { ToolNotice } from "@/components/tool-shell/tool-notice";
import { ToolActions } from "@/components/tool-shell/tool-actions";
import {
  FilePicker,
  FileResult,
  ProcessingStatus,
} from "@/components/file-tools";
import { formatFileSize } from "@/lib/file-tools/format";
import { createObjectUrlHandle } from "@/lib/file-tools/object-url";
import type { FileToolResult, FileToolStatus } from "@/lib/file-tools/types";
import { recordToolHistory } from "@/lib/storage/tool-activity";

import {
  getCompressedFilename,
  getSizeChange,
  getSupportedImageMime,
  imageCompressorAccept,
  maxImageCompressorBytes,
  type SupportedImageMime,
} from "./logic";

interface InspectionWorkerResult {
  readonly type: "inspected";
  readonly id: number;
  readonly width: number;
  readonly height: number;
}

interface CompressionWorkerResult {
  readonly type: "result";
  readonly id: number;
  readonly blob: Blob;
}

interface CompressionWorkerError {
  readonly type: "error";
  readonly id: number;
  readonly message: string;
}

type CompressionWorkerMessage =
  InspectionWorkerResult | CompressionWorkerResult | CompressionWorkerError;

interface ImageDetails {
  readonly width: number;
  readonly height: number;
  readonly mimeType: SupportedImageMime;
}

export default function ImageCompressorWorkspace({ slug }: { slug: string }) {
  const [file, setFile] = useState<File>();
  const [details, setDetails] = useState<ImageDetails>();
  const [quality, setQuality] = useState(82);
  const [originalUrl, setOriginalUrl] = useState<string>();
  const [compressedUrl, setCompressedUrl] = useState<string>();
  const [result, setResult] = useState<FileToolResult>();
  const [status, setStatus] = useState<FileToolStatus>("idle");
  const [error, setError] = useState("");
  const originalUrlHandle = useRef(createObjectUrlHandle());
  const compressedUrlHandle = useRef(createObjectUrlHandle());
  const workerRef = useRef<Worker | undefined>(undefined);
  const requestId = useRef(0);

  useEffect(
    () => () => {
      workerRef.current?.terminate();
      originalUrlHandle.current.dispose();
      compressedUrlHandle.current.dispose();
    },
    [],
  );

  function clearResult() {
    compressedUrlHandle.current.replace();
    setCompressedUrl(undefined);
    setResult(undefined);
  }

  function clearAll() {
    requestId.current += 1;
    workerRef.current?.terminate();
    workerRef.current = undefined;
    originalUrlHandle.current.replace();
    compressedUrlHandle.current.replace();
    setFile(undefined);
    setDetails(undefined);
    setOriginalUrl(undefined);
    setCompressedUrl(undefined);
    setResult(undefined);
    setError("");
    setStatus("idle");
  }

  function selectFile(nextFiles: readonly File[]) {
    if (nextFiles.length === 0) {
      clearAll();
      return;
    }

    const [nextFile] = nextFiles;
    const mimeType = getSupportedImageMime(nextFile);
    requestId.current += 1;
    const selectionId = requestId.current;
    workerRef.current?.terminate();
    workerRef.current = undefined;
    originalUrlHandle.current.replace();
    clearResult();
    setFile(nextFile);
    setDetails(undefined);
    setOriginalUrl(undefined);
    setError("");
    setStatus("processing");

    if (!mimeType) {
      setStatus("error");
      setError("Choose a PNG, JPG, JPEG, or WebP image.");
      return;
    }

    try {
      const worker = new Worker(
        new URL("./image-compressor.worker.ts", import.meta.url),
      );
      workerRef.current = worker;
      worker.onmessage = (event: MessageEvent<CompressionWorkerMessage>) => {
        const message = event.data;
        if (message.id !== selectionId || workerRef.current !== worker) return;

        worker.terminate();
        workerRef.current = undefined;
        if (message.type === "error") {
          setStatus("error");
          setError(message.message);
          return;
        }
        if (message.type !== "inspected") return;

        setDetails({
          width: message.width,
          height: message.height,
          mimeType,
        });
        setOriginalUrl(originalUrlHandle.current.replace(nextFile));
        setStatus("ready");
      };
      worker.onerror = () => {
        if (workerRef.current !== worker) return;
        worker.terminate();
        workerRef.current = undefined;
        setStatus("error");
        setError("The image could not be inspected. Please try again.");
      };
      worker.postMessage({
        type: "inspect",
        id: selectionId,
        file: nextFile,
        mimeType,
      });
    } catch {
      setStatus("error");
      setError(
        "This browser cannot inspect images locally. Try a current browser.",
      );
    }
  }

  function compress() {
    if (!file || !details || status === "processing") return;

    clearResult();
    setError("");
    setStatus("processing");
    requestId.current += 1;
    const id = requestId.current;

    try {
      const worker = new Worker(
        new URL("./image-compressor.worker.ts", import.meta.url),
      );
      workerRef.current = worker;
      worker.onmessage = (event: MessageEvent<CompressionWorkerMessage>) => {
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

        const sizeChange = getSizeChange(file.size, message.blob.size);
        setCompressedUrl(compressedUrlHandle.current.replace(message.blob));
        setResult({
          blob: message.blob,
          filename: getCompressedFilename(file.name, details.mimeType),
          mimeType: details.mimeType,
          summary: sizeChange
            ? `Compressed image is ${sizeChange.label}.`
            : undefined,
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
            { label: "Change", value: sizeChange?.label ?? "Size unavailable" },
          ],
        });
        setStatus("success");
        recordToolHistory(slug, "processed", { sensitive: false });
      };
      worker.onerror = () => {
        if (workerRef.current !== worker) return;
        worker.terminate();
        workerRef.current = undefined;
        setError(
          "The image compressor stopped unexpectedly. Please try again.",
        );
        setStatus("error");
      };
      worker.postMessage({
        type: "compress",
        id,
        file,
        mimeType: details.mimeType,
        quality,
      });
    } catch {
      setError(
        "This browser cannot start local image compression. Try a current browser.",
      );
      setStatus("error");
    }
  }

  function cancelCompression() {
    requestId.current += 1;
    workerRef.current?.terminate();
    workerRef.current = undefined;
    setStatus(details ? "ready" : "idle");
  }

  const isPng = details?.mimeType === "image/png";

  return (
    <div>
      <FilePicker
        accept={imageCompressorAccept}
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

      {file && details && originalUrl ? (
        <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_17rem]">
          <section aria-labelledby="original-image-title">
            <div className="flex items-baseline justify-between gap-3">
              <h2
                className="text-base font-bold text-ink"
                id="original-image-title"
              >
                Original image
              </h2>
              <p className="text-xs text-ink-subtle">
                {details.width} × {details.height} px ·{" "}
                {formatFileSize(file.size)}
              </p>
            </div>
            <div className="mt-3 flex min-h-56 items-center justify-center overflow-hidden rounded-card border border-line-strong bg-canvas p-3 sm:min-h-72">
              <img
                alt={`Original preview of ${file.name}`}
                className="max-h-96 max-w-full object-contain"
                src={originalUrl}
              />
            </div>
          </section>
          <section
            aria-labelledby="compression-settings-title"
            className="rounded-card border border-line bg-panel-muted p-4"
          >
            <h2
              className="text-base font-bold text-ink"
              id="compression-settings-title"
            >
              Compression
            </h2>
            {isPng ? (
              <p className="mt-3 text-sm leading-6 text-ink-muted">
                PNG keeps transparency. Browser PNG compression is lossless, so
                its size may not always decrease.
              </p>
            ) : (
              <label
                className="mt-4 block text-sm font-semibold text-ink"
                htmlFor="image-quality"
              >
                Quality
                <output className="float-right font-mono text-ink-muted">
                  {quality}
                </output>
                <input
                  aria-describedby="image-quality-help"
                  className="mt-3 w-full accent-accent"
                  id="image-quality"
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
                  id="image-quality-help"
                >
                  Lower quality usually makes JPG and WebP files smaller.
                </span>
              </label>
            )}
            <div className="mt-5 border-t border-line pt-4">
              <ToolActions label="Image compression actions">
                {status === "processing" ? (
                  <ActionButton
                    icon="x"
                    onClick={cancelCompression}
                    tone="quiet"
                  >
                    Cancel
                  </ActionButton>
                ) : (
                  <ActionButton
                    disabled={!details}
                    icon="refresh-cw"
                    onClick={compress}
                    tone="primary"
                  >
                    Compress image
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
          {compressedUrl ? (
            <section aria-labelledby="compressed-image-title" className="mt-6">
              <h2
                className="text-base font-bold text-ink"
                id="compressed-image-title"
              >
                Compressed preview
              </h2>
              <div className="mt-3 flex min-h-56 items-center justify-center overflow-hidden rounded-card border border-line-strong bg-canvas p-3 sm:min-h-72">
                <img
                  alt="Compressed preview"
                  className="max-h-96 max-w-full object-contain"
                  src={compressedUrl}
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
