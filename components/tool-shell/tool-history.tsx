"use client";

import { useSyncExternalStore } from "react";

import type { ToolDefinition } from "@/lib/catalog/types";
import {
  clearToolHistory,
  getStorageSnapshot,
  getToolHistoryStorageKey,
  parseToolHistory,
  subscribeToToolActivity,
} from "@/lib/storage/tool-activity";

import { ClearButton } from "./clear-button";

interface ToolHistoryProps {
  tool: Pick<ToolDefinition, "slug" | "sensitive">;
  enabled?: boolean;
}

const emptySnapshot = "[]";

export function ToolHistory({ tool, enabled = !tool.sensitive }: ToolHistoryProps) {
  const storageKey = getToolHistoryStorageKey(tool.slug);
  const snapshot = useSyncExternalStore(
    subscribeToToolActivity,
    () => getStorageSnapshot(storageKey),
    () => emptySnapshot,
  );
  const entries = parseToolHistory(snapshot);

  if (!enabled) {
    return (
      <aside className="rounded-card border border-line bg-panel-muted p-4 text-sm leading-6 text-ink-muted">
        Local tool history is off for this sensitive tool. Inputs and outputs are
        never stored here.
      </aside>
    );
  }

  if (entries.length === 0) return null;

  return (
    <section aria-labelledby="tool-history-title">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-ink" id="tool-history-title">
            Activity on this device
          </h2>
          <p className="mt-1 text-xs leading-5 text-ink-subtle">
            Action names and timestamps only. Tool content is not stored.
          </p>
        </div>
        <ClearButton label="Clear history" onClear={() => clearToolHistory(tool.slug)} />
      </div>
      <ol className="mt-4 divide-y divide-line rounded-card border border-line bg-panel px-4">
        {entries.map((entry) => (
          <li className="flex items-center justify-between gap-4 py-3 text-sm" key={entry.id}>
            <span className="font-medium text-ink">{entry.action}</span>
            <time className="shrink-0 text-xs text-ink-subtle" dateTime={entry.timestamp}>
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
