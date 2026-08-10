"use client";

/* eslint-disable @next/next/no-img-element -- previews use local object URLs only. */

import { useEffect, useRef, useState } from "react";

import { FilePicker, FileResult, ProcessingStatus } from "@/components/file-tools";
import { ActionButton } from "@/components/tool-shell/action-button";
import { ClearButton } from "@/components/tool-shell/clear-button";
import { ToolActions } from "@/components/tool-shell/tool-actions";
import { ToolNotice } from "@/components/tool-shell/tool-notice";
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
import { getMetadataRemovedFilename } from "./logic";

type WorkerMessage =
  | { type: "inspected"; id: number; width: number; height: number }
  | { type: "result"; id: number; blob: Blob }
  | { type: "error"; id: number; message: string };

type ImageDetails = {
  readonly width: number;
  readonly height: number;
  readonly mimeType: SupportedImageMime;
};

export default function ImageMetadataRemoverWorkspace({
  slug,
}: {
  slug: string;
}) {
  const [file, setFile] = useState<File>();
  const [details, setDetails] = useState<ImageDetails>();
  const [quality, setQuality] = useState(92);
  const [sourceUrl, setSourceUrl] = useState<string>();
  const [resultUrl, setResultUrl] = useState<string>();
  const [result, setResult] = useState<FileToolResult>();
  const [status, setStatus] = useState<FileToolStatus>("idle");
  const [error, setError] = useState("");
  const sourceHandle = useRef(createObjectUrlHandle());
  const resultHandle = useRef(createObjectUrlHandle());
  const workerRef = useRef<Worker | undefined>(undefined);
  const requestId = useRef(0);

  useEffect(
    () => () => {
      workerRef.current?.terminate();
      sourceHandle.current.dispose();
      resultHandle.current.dispose();
    },
    [],
  );

  function clearResult() {
    resultHandle.current.replace();
    setResultUrl(undefined);
    setResult(undefined);
  }

  function clearAll() {
    requestId.current += 1;
    workerRef.current?.terminate();
    workerRef.current = undefined;
    sourceHandle.current.replace();
    resultHandle.current.replace();
    setFile(undefined);
    setDetails(undefined);
    setSourceUrl(undefined);
    setResultUrl(undefined);
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
        new URL("../image-compressor/image-compressor.worker.ts", import.meta.url),
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
        setSourceUrl(sourceHandle.current.replace(nextFile));
        setStatus("ready");
      };
      worker.onerror = () => {
        if (workerRef.current !== worker) return;
        worker.terminate();
        workerRef.current = undefined;
        setError("The image could not be inspected. Please try again.");
        setStatus("error");
      };
      worker.postMessage({ type: "inspect", id, file: nextFile, mimeType });
    } catch {
      setError("This browser cannot inspect images locally. Try a current browser.");
      setStatus("error");
    }
  }

  function removeMetadata() {
    if (!file || !details || status === "processing") return;
    clearResult();
    setError("");
    setStatus("processing");
    requestId.current += 1;
    const id = requestId.current;
    try {
      const worker = new Worker(
        new URL("../image-compressor/image-compressor.worker.ts", import.meta.url),
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
        setResultUrl(resultHandle.current.replace(message.blob));
        setResult({
          blob: message.blob,
          filename: getMetadataRemovedFilename(file.name, details.mimeType),
          mimeType: details.mimeType,
          summary:
            "A new image file was created from decoded pixels. The original metadata containers were not copied.",
          before: [
            { label: "Filename", value: file.name },
            { label: "Dimensions", value: `${details.width} × ${details.height} px` },
            { label: "File size", value: formatFileSize(file.size) },
          ],
          after: [
            { label: "Dimensions", value: `${details.width} × ${details.height} px` },
            { label: "File size", value: formatFileSize(message.blob.size) },
            { label: "Format", value: details.mimeType === "image/jpeg" ? "JPG" : details.mimeType.slice("image/".length).toUpperCase() },
          ],
        });
        setStatus("success");
        recordToolHistory(slug, "processed", { sensitive: false });
      };
      worker.onerror = () => {
        if (workerRef.current !== worker) return;
        worker.terminate();
        workerRef.current = undefined;
        setError("The local image export stopped unexpectedly. Please try again.");
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
      setError("This browser cannot start local image export. Try a current browser.");
      setStatus("error");
    }
  }

  const lossy = details?.mimeType === "image/jpeg" || details?.mimeType === "image/webp";

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
        <ToolNotice title="How this works" tone="info">
          Your image is decoded and exported as a new file in this browser. Its original metadata containers are not copied. This tool does not inspect the output or guarantee removal of every possible browser-generated field.
        </ToolNotice>
      </div>
      <ProcessingStatus message={error || undefined} status={status} />

      {file && details && sourceUrl ? (
        <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_17rem]">
          <section aria-labelledby="metadata-source-title">
            <h2 className="text-base font-bold text-ink" id="metadata-source-title">Source image</h2>
            <p className="mt-1 text-xs text-ink-subtle">
              {file.name} · {details.width} × {details.height} px · {formatFileSize(file.size)}
            </p>
            <div className="mt-3 flex min-h-56 items-center justify-center overflow-hidden rounded-card border border-line-strong bg-canvas p-3 sm:min-h-72">
              <img alt={`Source preview of ${file.name}`} className="max-h-96 max-w-full object-contain" src={sourceUrl} />
            </div>
          </section>
          <section aria-labelledby="metadata-settings-title" className="rounded-card border border-line bg-panel-muted p-4">
            <h2 className="text-base font-bold text-ink" id="metadata-settings-title">Export</h2>
            <p className="mt-3 text-sm leading-6 text-ink-muted">
              The output keeps the displayed pixel orientation and the original file format. Re-encoding can change file size.
            </p>
            {lossy ? (
              <label className="mt-5 block text-sm font-semibold text-ink" htmlFor="metadata-quality">
                Quality
                <output className="float-right font-mono text-ink-muted">{quality}</output>
                <input
                  aria-describedby="metadata-quality-help"
                  className="mt-3 w-full accent-accent"
                  id="metadata-quality"
                  max="100"
                  min="60"
                  onChange={(event) => {
                    setQuality(event.target.valueAsNumber);
                    clearResult();
                    if (status === "success") setStatus("ready");
                  }}
                  type="range"
                  value={quality}
                />
                <span className="mt-2 block text-xs font-normal leading-5 text-ink-subtle" id="metadata-quality-help">
                  A high default quality helps retain visual detail in JPG and WebP exports.
                </span>
              </label>
            ) : null}
            <div className="mt-5 border-t border-line pt-4">
              <ToolActions label="Metadata removal actions">
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
                  <ActionButton disabled={!details} icon="refresh-cw" onClick={removeMetadata} tone="primary">
                    Create sanitized image
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
          {resultUrl ? (
            <section aria-labelledby="metadata-result-preview-title" className="mt-6">
              <h2 className="text-base font-bold text-ink" id="metadata-result-preview-title">Sanitized preview</h2>
              <div className="mt-3 flex min-h-56 items-center justify-center overflow-hidden rounded-card border border-line-strong bg-canvas p-3 sm:min-h-72">
                <img alt="Sanitized export preview" className="max-h-96 max-w-full object-contain" src={resultUrl} />
              </div>
            </section>
          ) : null}
          <FileResult
            analyticsKind="image"
            downloadTone="primary"
            onClear={clearAll}
            onDownloaded={() => recordToolHistory(slug, "downloaded", { sensitive: false })}
            result={result}
          />
        </>
      ) : null}
    </div>
  );
}
