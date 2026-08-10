"use client";

/* eslint-disable @next/next/no-img-element -- previews use local object URLs only. */

import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  type PercentCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
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
import {
  cropAspectPresets,
  getCropAspect,
  getCroppedFilename,
  normalizeCropArea,
  type CropArea,
  type CropAspectPreset,
} from "./logic";

type WorkerMessage =
  | { type: "inspected"; id: number; width: number; height: number }
  | { type: "result"; id: number; blob: Blob }
  | { type: "error"; id: number; message: string };

type ImageDetails = {
  readonly width: number;
  readonly height: number;
  readonly mimeType: SupportedImageMime;
};

function getExtension(mimeType: SupportedImageMime) {
  return mimeType === "image/jpeg" ? "jpg" : mimeType.slice("image/".length);
}

function getInitialCrop(
  image: HTMLImageElement,
  preset: CropAspectPreset,
): PercentCrop {
  const aspect = getCropAspect(preset);
  if (!aspect) return { unit: "%", x: 5, y: 5, width: 90, height: 90 };
  return centerCrop(
    makeAspectCrop({ unit: "%", width: 90 }, aspect, image.width, image.height),
    image.width,
    image.height,
  );
}

export default function ImageCropperWorkspace({ slug }: { slug: string }) {
  const [file, setFile] = useState<File>();
  const [details, setDetails] = useState<ImageDetails>();
  const [sourceUrl, setSourceUrl] = useState<string>();
  const [outputUrl, setOutputUrl] = useState<string>();
  const [result, setResult] = useState<FileToolResult>();
  const [status, setStatus] = useState<FileToolStatus>("idle");
  const [error, setError] = useState("");
  const [crop, setCrop] = useState<PercentCrop>();
  const [preset, setPreset] = useState<CropAspectPreset>("free");
  const [cropArea, setCropArea] = useState<CropArea>();
  const [quality, setQuality] = useState(82);
  const sourceHandle = useRef(createObjectUrlHandle());
  const outputHandle = useRef(createObjectUrlHandle());
  const workerRef = useRef<Worker | undefined>(undefined);
  const requestId = useRef(0);
  const imageRef = useRef<HTMLImageElement | undefined>(undefined);

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
    setSourceUrl(undefined);
    setOutputUrl(undefined);
    setResult(undefined);
    setError("");
    setStatus("idle");
    setCrop(undefined);
    setPreset("free");
    setCropArea(undefined);
  }

  function resetCrop() {
    if (imageRef.current) setCrop(getInitialCrop(imageRef.current, preset));
    clearResult();
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
    setCrop(undefined);
    setPreset("free");
    setCropArea(undefined);

    if (!mimeType) {
      setError("Choose a PNG, JPG, JPEG, or WebP image.");
      setStatus("error");
      return;
    }

    try {
      const worker = new Worker(
        new URL("../image-converter/image-converter.worker.ts", import.meta.url),
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

  function cropImage() {
    if (!file || !details || !cropArea) return;
    const normalizedCrop = normalizeCropArea(cropArea, details);
    if (!normalizedCrop) {
      setError("Adjust the crop area before exporting.");
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
        new URL("../image-converter/image-converter.worker.ts", import.meta.url),
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
          filename: getCroppedFilename(file.name, getExtension(details.mimeType)),
          mimeType: details.mimeType,
          summary: `Cropped to ${normalizedCrop.width} × ${normalizedCrop.height} px.`,
          before: [
            { label: "Dimensions", value: `${details.width} × ${details.height} px` },
            { label: "File size", value: formatFileSize(file.size) },
          ],
          after: [
            {
              label: "Dimensions",
              value: `${normalizedCrop.width} × ${normalizedCrop.height} px`,
            },
            { label: "File size", value: formatFileSize(message.blob.size) },
          ],
        });
        setStatus("success");
        recordToolHistory(slug, "processed", { sensitive: false });
      };
      worker.onerror = () => {
        if (workerRef.current !== worker) return;
        worker.terminate();
        workerRef.current = undefined;
        setError("The image cropper stopped unexpectedly. Please try again.");
        setStatus("error");
      };
      worker.postMessage({
        type: "crop",
        id,
        file,
        outputType: details.mimeType,
        quality,
        background: "#ffffff",
        crop: normalizedCrop,
      });
    } catch {
      setError("This browser cannot start local image cropping. Try a current browser.");
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
        <ToolNotice title="Metadata" tone="info">
          Cropping re-encodes the image and may remove optional metadata, such as camera details and location.
        </ToolNotice>
      </div>
      <ProcessingStatus message={error || undefined} status={status} />

      {file && details && sourceUrl ? (
        <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_17rem]">
          <section aria-labelledby="crop-preview-title">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-ink" id="crop-preview-title">
                  Crop image
                </h2>
                <p className="mt-1 text-xs text-ink-subtle">
                  {details.width} × {details.height} px · {formatFileSize(file.size)}
                </p>
              </div>
              {cropArea ? (
                <p className="text-xs font-semibold text-ink-muted" aria-live="polite">
                  Output: {cropArea.width} × {cropArea.height} px
                </p>
              ) : null}
            </div>
            <div className="mt-3 flex min-h-72 items-center justify-center overflow-auto rounded-card border border-line-strong bg-canvas p-3">
              <ReactCrop
                aspect={getCropAspect(preset)}
                crop={crop}
                keepSelection
                onChange={(_, percentCrop) => {
                  setCrop(percentCrop);
                  clearResult();
                }}
                onComplete={(_, percentCrop) => {
                  if (!details) return;
                  setCropArea({
                    x: (percentCrop.x / 100) * details.width,
                    y: (percentCrop.y / 100) * details.height,
                    width: (percentCrop.width / 100) * details.width,
                    height: (percentCrop.height / 100) * details.height,
                  });
                }}
                ruleOfThirds
              >
                <img
                  alt={`Crop preview of ${file.name}`}
                  className="max-h-[30rem] max-w-full object-contain"
                  onLoad={(event) => {
                    imageRef.current = event.currentTarget;
                    setCrop(getInitialCrop(event.currentTarget, preset));
                  }}
                  src={sourceUrl}
                />
              </ReactCrop>
            </div>
            <p className="mt-3 text-xs leading-5 text-ink-subtle">
              Drag the crop area to move it, or drag its handles to resize it. The crop library also supports keyboard adjustments when the crop area is focused.
            </p>
          </section>

          <section aria-labelledby="crop-settings-title" className="rounded-card border border-line bg-panel-muted p-4">
            <h2 className="text-base font-bold text-ink" id="crop-settings-title">
              Crop settings
            </h2>
            <fieldset className="mt-4">
              <legend className="text-sm font-semibold text-ink">Aspect ratio</legend>
              <div className="mt-2 grid grid-cols-3 gap-2" role="group" aria-label="Aspect ratio presets">
                {cropAspectPresets.map((option) => (
                  <button
                    aria-pressed={preset === option.value}
                    className={`min-h-11 rounded-control border px-2 text-sm font-semibold transition-colors ${preset === option.value ? "border-accent bg-accent-soft text-accent" : "border-line-strong bg-canvas text-ink hover:border-accent/60"}`}
                    key={option.value}
                    onClick={() => {
                      setPreset(option.value);
                      if (imageRef.current) {
                        setCrop(getInitialCrop(imageRef.current, option.value));
                      }
                      clearResult();
                    }}
                    type="button"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </fieldset>
            {lossy ? (
              <label className="mt-5 block text-sm font-semibold text-ink">
                Quality <output className="float-right font-mono text-ink-muted">{quality}</output>
                <input
                  aria-label="Output quality"
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
            <div className="mt-5 border-t border-line pt-4">
              <ToolActions label="Crop actions">
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
                  <ActionButton onClick={cropImage} tone="primary">
                    Crop image
                  </ActionButton>
                )}
                <ActionButton icon="refresh-cw" onClick={resetCrop} tone="quiet">
                  Reset crop
                </ActionButton>
                <ClearButton disabled={!file} onClear={clearAll} />
              </ToolActions>
            </div>
          </section>
        </div>
      ) : null}

      {result ? (
        <>
          {outputUrl ? (
            <section aria-labelledby="cropped-preview-title" className="mt-6">
              <h2 className="text-base font-bold text-ink" id="cropped-preview-title">Cropped preview</h2>
              <div className="mt-3 flex min-h-56 items-center justify-center overflow-hidden rounded-card border border-line-strong bg-canvas p-3 sm:min-h-72">
                <img alt="Cropped preview" className="max-h-96 max-w-full object-contain" src={outputUrl} />
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
