"use client";

/* eslint-disable @next/next/no-img-element -- previews use local object URLs only. */

import { useEffect, useRef, useState } from "react";

import {
  FilePicker,
  FileResult,
  ProcessingStatus,
} from "@/components/file-tools";
import { ActionButton } from "@/components/tool-shell/action-button";
import { ClearButton } from "@/components/tool-shell/clear-button";
import { ToolActions } from "@/components/tool-shell/tool-actions";
import { ToolNotice } from "@/components/tool-shell/tool-notice";
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
  getRotatedDimensions,
  getRotatedFilename,
  hasImageTransform,
  type Rotation,
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

const rotationOptions = [
  { value: "0", label: "No rotation" },
  { value: "90", label: "90° clockwise" },
  { value: "180", label: "180°" },
  { value: "270", label: "90° counter-clockwise" },
] as const;

export default function RotateFlipImageWorkspace({ slug }: { slug: string }) {
  const [file, setFile] = useState<File>();
  const [details, setDetails] = useState<ImageDetails>();
  const [rotation, setRotation] = useState<Rotation>(0);
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [flipVertical, setFlipVertical] = useState(false);
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
    setRotation(0);
    setFlipHorizontal(false);
    setFlipVertical(false);
    setOutputType(undefined);
    setSourceUrl(undefined);
    setOutputUrl(undefined);
    setResult(undefined);
    setError("");
    setStatus("idle");
  }

  function inspect(files: readonly File[]) {
    const nextFile = files[0];
    if (!nextFile) {
      clearAll();
      return;
    }
    const mimeType = getSupportedImageMime(nextFile);
    requestId.current += 1;
    const id = requestId.current;
    workerRef.current?.terminate();
    sourceHandle.current.replace();
    clearResult();
    setFile(nextFile);
    setDetails(undefined);
    setRotation(0);
    setFlipHorizontal(false);
    setFlipVertical(false);
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
        setDetails({ width: message.width, height: message.height, mimeType });
        setOutputType(mimeType);
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
      setError(
        "This browser cannot inspect images locally. Try a current browser.",
      );
      setStatus("error");
    }
  }

  function transform() {
    if (!file || !details || !outputType || status === "processing") return;
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
        const dimensions = getRotatedDimensions(details, rotation);
        const extension =
          outputType === "image/jpeg" ? "jpg" : outputType.slice(6);
        setOutputUrl(outputHandle.current.replace(message.blob));
        setResult({
          blob: message.blob,
          filename: getRotatedFilename(file.name, extension),
          mimeType: outputType,
          summary:
            "Image transformed locally. Optional original metadata containers were not copied.",
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
              value: `${dimensions.width} × ${dimensions.height} px`,
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
        setError(
          "The image transformer stopped unexpectedly. Please try again.",
        );
        setStatus("error");
      };
      worker.postMessage({
        type: "rotate",
        id,
        file,
        outputType,
        quality,
        background,
        rotation,
        flipHorizontal,
        flipVertical,
      });
    } catch {
      setError(
        "This browser cannot transform images locally. Try a current browser.",
      );
      setStatus("error");
    }
  }

  const outputOptions = details
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
  const dimensions = details
    ? getRotatedDimensions(details, rotation)
    : undefined;
  const transformSelected = hasImageTransform(
    rotation,
    flipHorizontal,
    flipVertical,
  );

  return (
    <div>
      <FilePicker
        accept={imageCompressorAccept}
        description="PNG, JPG, JPEG, or WebP images."
        disabled={status === "processing"}
        expectedOutput="A rotated or mirrored image in your selected format."
        files={file ? [file] : []}
        label="Choose an image or drop it here"
        maxSizeBytes={maxImageCompressorBytes}
        onFilesChange={inspect}
      />
      <div className="mt-4">
        <ToolNotice title="Metadata" tone="info">
          Rotation and flipping create a new image export. Optional original
          metadata containers, including camera details and location, may not be
          copied.
        </ToolNotice>
      </div>
      <ProcessingStatus message={error || undefined} status={status} />

      {file && details && sourceUrl && outputType ? (
        <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_17rem]">
          <section aria-labelledby="rotate-source-title">
            <h2
              className="text-base font-bold text-ink"
              id="rotate-source-title"
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
            aria-labelledby="rotate-settings-title"
            className="rounded-card border border-line bg-panel-muted p-4"
          >
            <h2
              className="text-base font-bold text-ink"
              id="rotate-settings-title"
            >
              Transform image
            </h2>
            <div className="mt-4">
              <CustomSelect
                id="rotate-degrees"
                label="Rotation"
                onChange={(value) => {
                  setRotation(Number(value) as Rotation);
                  clearResult();
                }}
                options={rotationOptions}
                value={String(rotation)}
              />
            </div>
            <fieldset className="mt-4 grid gap-3">
              <legend className="text-sm font-semibold text-ink">Mirror</legend>
              <label className="flex min-h-11 items-center gap-3 text-sm font-semibold text-ink">
                <input
                  checked={flipHorizontal}
                  className="size-4 accent-accent"
                  onChange={(event) => {
                    setFlipHorizontal(event.target.checked);
                    clearResult();
                  }}
                  type="checkbox"
                />{" "}
                Flip horizontally
              </label>
              <label className="flex min-h-11 items-center gap-3 text-sm font-semibold text-ink">
                <input
                  checked={flipVertical}
                  className="size-4 accent-accent"
                  onChange={(event) => {
                    setFlipVertical(event.target.checked);
                    clearResult();
                  }}
                  type="checkbox"
                />{" "}
                Flip vertically
              </label>
            </fieldset>
            {dimensions ? (
              <p className="mt-4 text-xs leading-5 text-ink-subtle">
                Output dimensions: {dimensions.width} × {dimensions.height} px
              </p>
            ) : null}
            <div className="mt-4">
              <CustomSelect
                id="rotate-output-format"
                label="Output format"
                onChange={(value) => {
                  setOutputType(value as SupportedImageMime);
                  clearResult();
                }}
                options={outputOptions}
                value={outputType}
              />
            </div>
            {lossy ? (
              <label className="mt-4 block text-sm font-semibold text-ink">
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
                  id="rotate-jpg-background"
                  label="JPG background"
                  onChange={setBackground}
                  value={background}
                />
              </div>
            ) : null}
            <div className="mt-5 border-t border-line pt-4">
              <ToolActions label="Rotate and flip actions">
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
                    disabled={!transformSelected}
                    icon="refresh-cw"
                    onClick={transform}
                    tone="primary"
                  >
                    Apply transform
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
          <section aria-labelledby="transformed-preview-title" className="mt-6">
            {outputUrl ? (
              <>
                <h2
                  className="text-base font-bold text-ink"
                  id="transformed-preview-title"
                >
                  Transformed preview
                </h2>
                <div className="mt-3 flex min-h-56 items-center justify-center overflow-hidden rounded-card border border-line-strong bg-canvas p-3 sm:min-h-72">
                  <img
                    alt="Transformed preview"
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
