"use client";

import { FileDropzone } from "@/components/tool-shell/file-dropzone";

import { FileList } from "./file-list";

interface FilePickerProps {
  files: readonly File[];
  onFilesChange: (files: readonly File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSizeBytes?: number;
  disabled?: boolean;
  label?: string;
  description?: string;
}

export function FilePicker({
  files,
  onFilesChange,
  accept,
  multiple = false,
  maxSizeBytes,
  disabled = false,
  label,
  description,
}: FilePickerProps) {
  function addFiles(incomingFiles: readonly File[]) {
    onFilesChange(
      multiple ? [...files, ...incomingFiles] : incomingFiles.slice(0, 1),
    );
  }

  return (
    <div>
      <FileDropzone
        accept={accept}
        description={description}
        disabled={disabled}
        label={label}
        maxSizeBytes={maxSizeBytes}
        multiple={multiple}
        onFiles={addFiles}
      />
      <FileList
        files={files}
        onRemove={
          disabled
            ? undefined
            : (index) =>
                onFilesChange(
                  files.filter((_, itemIndex) => itemIndex !== index),
                )
        }
      />
    </div>
  );
}
