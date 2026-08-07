"use client";

import { useSyncExternalStore } from "react";

import {
  getStorageSnapshot,
  parseRecentToolSlugs,
  RECENT_TOOLS_STORAGE_KEY,
  subscribeToToolActivity,
} from "@/lib/storage/tool-activity";
import type { ToolDefinition } from "@/lib/catalog/types";

import { ToolCard } from "./tool-card";

interface RecentToolsProps {
  tools: readonly ToolDefinition[];
}

const emptySnapshot = "[]";
const visibleRecentToolLimit = 3;

export function RecentTools({ tools }: RecentToolsProps) {
  const snapshot = useSyncExternalStore(
    subscribeToToolActivity,
    () => getStorageSnapshot(RECENT_TOOLS_STORAGE_KEY),
    () => emptySnapshot,
  );
  const recentSlugs = parseRecentToolSlugs(snapshot);
  const toolsBySlug = new Map(tools.map((tool) => [tool.slug, tool]));
  const recentTools = recentSlugs
    .map((slug) => toolsBySlug.get(slug))
    .filter((tool): tool is ToolDefinition => tool !== undefined)
    .slice(0, visibleRecentToolLimit);

  if (recentTools.length === 0) return null;

  return (
    <section
      aria-labelledby="recent-tools-title"
      className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 sm:pt-20 lg:px-8"
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
          Stored on this device
        </p>
        <h2
          className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-ink"
          id="recent-tools-title"
        >
          Recently used
        </h2>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recentTools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </section>
  );
}
