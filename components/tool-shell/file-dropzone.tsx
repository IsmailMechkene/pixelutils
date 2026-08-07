"use client";

/* eslint-disable jsx-a11y/no-noninteractive-element-interactions -- The native file input remains the keyboard control; its label also accepts pointer drops. */

import { useId, useState } from "react";

import { Icon } from "@/components/ui/icon";

import { ErrorMessage } from "./error-message";

interface FileDropzoneProps {
  onFiles: (files: readonly File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSizeBytes?: number;
  disabled?: boolean;
  label?: string;
  description?: string;
}

export function FileDropzone({
  onFiles,
  accept,
  multiple = false,
  maxSizeBytes = 10 * 1024 * 1024,
  disabled = false,
  label = "Choose a file or drop it here",
  description = "The file stays in your browser.",
}: FileDropzoneProps) {
  const inputId = useId();
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string>();
  const errorId = `${inputId}-error`;

  function handleFiles(fileList: FileList | null) {
    const files = Array.from(fileList ?? []);
    if (files.length === 0) return;

    const oversizedFile = files.find((file) => file.size > maxSizeBytes);
    if (oversizedFile) {
      setError(
        `${oversizedFile.name} is larger than ${Math.round(maxSizeBytes / 1024 / 1024)} MB.`,
      );
      return;
    }

    setError(undefined);
    onFiles(multiple ? files : files.slice(0, 1));
  }

  return (
    <div>
      <input
        accept={accept}
        aria-describedby={error ? errorId : undefined}
        aria-invalid={Boolean(error)}
        className="peer sr-only"
        disabled={disabled}
        id={inputId}
        multiple={multiple}
        onChange={(event) => {
          handleFiles(event.target.files);
          event.target.value = "";
        }}
        type="file"
      />
      <label
        className={`flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-card border border-dashed px-6 py-8 text-center transition-colors duration-150 peer-focus-visible:outline peer-focus-visible:outline-3 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-accent ${
          isDragging
            ? "border-accent bg-accent-soft"
            : "border-line-strong bg-canvas hover:border-accent"
        } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
        htmlFor={inputId}
        onDragEnter={(event) => {
          event.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          if (!disabled) handleFiles(event.dataTransfer.files);
        }}
      >
        <span className="grid size-11 place-items-center rounded-card bg-accent-soft text-accent">
          <Icon className="size-5" name="file" />
        </span>
        <span className="mt-4 text-sm font-semibold text-ink">{label}</span>
        <span className="mt-1 text-xs leading-5 text-ink-subtle">
          {description}
        </span>
      </label>
      {error ? (
        <div className="mt-3">
          <ErrorMessage id={errorId} message={error} />
        </div>
      ) : null}
    </div>
  );
}
