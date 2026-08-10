"use client";

import { useRef, type ReactNode } from "react";

import { ActionButton } from "@/components/tool-shell/action-button";
import { Icon } from "@/components/ui/icon";
import { formatFileSize } from "@/lib/file-tools/format";

interface ReorderableFileListProps {
  readonly files: readonly File[];
  readonly onFilesChange: (files: readonly File[]) => void;
  readonly disabled?: boolean;
  readonly renderPreview?: (file: File, index: number) => ReactNode;
  readonly fileDetails?: (file: File) => string;
}

function moveItem<T>(items: readonly T[], from: number, to: number) {
  if (to < 0 || to >= items.length || from === to) return [...items];
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export function ReorderableFileList({
  files,
  onFilesChange,
  disabled = false,
  renderPreview,
  fileDetails,
}: ReorderableFileListProps) {
  const dragIndex = useRef<number | undefined>(undefined);

  if (!files.length) return null;

  return (
    <ol className="mt-3 divide-y divide-line rounded-card border border-line bg-panel-muted">
      {files.map((file, index) => (
        <li
          className="flex min-w-0 items-center gap-3 px-3.5 py-3 sm:px-4"
          key={`${file.name}-${file.size}-${file.lastModified}-${index}`}
        >
          {renderPreview ? (
            renderPreview(file, index)
          ) : (
            <span className="grid size-10 shrink-0 place-items-center rounded-control border border-line bg-panel text-ink-muted" aria-hidden="true">
              <Icon className="size-4" name="file" />
            </span>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-ink">
              <span className="mr-2 font-mono text-xs text-ink-subtle">{index + 1}.</span>
              {file.name}
            </p>
            <p className="mt-0.5 text-xs text-ink-subtle">
              {fileDetails?.(file) ?? `File · ${formatFileSize(file.size)}`}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <ActionButton
              aria-label={`Drag ${file.name} to a new position`}
              className="px-2.5"
              disabled={disabled}
              draggable={!disabled}
              onDragEnd={() => {
                dragIndex.current = undefined;
              }}
              onDragOver={(event) => event.preventDefault()}
              onDragStart={() => {
                dragIndex.current = index;
              }}
              onDrop={() => {
                if (dragIndex.current === undefined) return;
                onFilesChange(moveItem(files, dragIndex.current, index));
                dragIndex.current = undefined;
              }}
              tone="quiet"
            >
              Drag
            </ActionButton>
            <ActionButton
              aria-label={`Move ${file.name} earlier`}
              className="px-2.5"
              disabled={disabled || index === 0}
              onClick={() => onFilesChange(moveItem(files, index, index - 1))}
              tone="quiet"
            >
              Up
            </ActionButton>
            <ActionButton
              aria-label={`Move ${file.name} later`}
              className="px-2.5"
              disabled={disabled || index === files.length - 1}
              onClick={() => onFilesChange(moveItem(files, index, index + 1))}
              tone="quiet"
            >
              Down
            </ActionButton>
            <ActionButton
              aria-label={`Remove ${file.name}`}
              className="px-2.5"
              disabled={disabled}
              icon="x"
              onClick={() =>
                onFilesChange(files.filter((_, itemIndex) => itemIndex !== index))
              }
              tone="quiet"
            >
              Remove
            </ActionButton>
          </div>
        </li>
      ))}
    </ol>
  );
}
