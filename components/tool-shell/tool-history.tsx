"use client";

import { useEffect, useSyncExternalStore } from "react";

import type { ToolDefinition } from "@/lib/catalog/types";
import {
  clearToolHistory,
  getStorageSnapshot,
  getToolHistoryStorageKey,
  parseToolHistory,
  subscribeToToolActivity,
  recordRecentTool,
  TOOL_HISTORY_LIMIT,
  type ToolHistoryAction,
} from "@/lib/storage/tool-activity";

import { ClearButton } from "./clear-button";

interface ToolHistoryProps {
  tool: Pick<ToolDefinition, "slug" | "sensitive">;
  enabled?: boolean;
}

const emptySnapshot = "[]";
const actionLabels: Record<ToolHistoryAction, string> = {
  processed: "Processed input",
  copied: "Copied output",
  downloaded: "Downloaded output",
  cleared: "Cleared workspace",
  sampled: "Loaded sample",
  swapped: "Swapped input and output",
};

export function ToolHistory({
  tool,
  enabled = !tool.sensitive,
}: ToolHistoryProps) {
  const storageKey = getToolHistoryStorageKey(tool.slug);
  const snapshot = useSyncExternalStore(
    subscribeToToolActivity,
    () => getStorageSnapshot(storageKey),
    () => emptySnapshot,
  );
  const entries = parseToolHistory(snapshot);

  useEffect(() => {
    recordRecentTool(tool.slug);
  }, [tool.slug]);

  if (!enabled) {
    return (
      <aside className="rounded-card border border-line bg-panel-muted p-4 text-sm leading-6 text-ink-muted">
        Local tool history is off for this sensitive tool. Inputs and outputs
        are never stored here.
      </aside>
    );
  }

  if (entries.length === 0) return null;

  return (
    <section aria-labelledby="tool-history-title">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2
            className="text-lg font-semibold text-ink"
            id="tool-history-title"
          >
            Activity on this device
          </h2>
          <p className="mt-1 text-xs leading-5 text-ink-subtle">
            Latest {TOOL_HISTORY_LIMIT} actions at most. Tool content is never
            stored.
          </p>
        </div>
        <ClearButton
          label="Clear history"
          onClear={() => clearToolHistory(tool.slug)}
        />
      </div>
      <ol
        aria-label="Recent activity"
        className="search-results-scrollbar mt-4 max-h-72 divide-y divide-line overflow-y-auto overscroll-contain rounded-card border border-line bg-panel px-4"
      >
        {entries.map((entry, index) => (
          <li
            className="flex items-center justify-between gap-4 py-3 text-sm"
            key={`${entry.timestamp}-${entry.action}-${index}`}
          >
            <span className="font-medium text-ink">
              {actionLabels[entry.action]}
            </span>
            <time
              className="shrink-0 text-xs text-ink-subtle"
              dateTime={entry.timestamp}
            >
              {new Intl.DateTimeFormat(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              }).format(new Date(entry.timestamp))}
            </time>
          </li>
        ))}
      </ol>
    </section>
  );
}
