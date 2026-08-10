"use client";

import { useLayoutEffect, useState } from "react";

import {
  getStorageSnapshot,
  parseRecentToolSlugs,
  RECENT_TOOLS_STORAGE_KEY,
  subscribeToToolActivity,
} from "@/lib/storage/tool-activity";
import type { ToolCardItem } from "@/lib/catalog/types";

import { ToolCard } from "./tool-card";

interface RecentToolsProps {
  tools: readonly ToolCardItem[];
}

const visibleRecentToolLimit = 3;

export function RecentTools({ tools }: RecentToolsProps) {
  const [recentSlugs, setRecentSlugs] = useState<string[]>([]);

  useLayoutEffect(() => {
    const updateRecentTools = () => {
      setRecentSlugs(
        parseRecentToolSlugs(getStorageSnapshot(RECENT_TOOLS_STORAGE_KEY)),
      );
    };

    updateRecentTools();
    return subscribeToToolActivity(updateRecentTools);
  }, []);

  const toolsBySlug = new Map(tools.map((tool) => [tool.slug, tool]));
  const recentTools = recentSlugs
    .map((slug) => toolsBySlug.get(slug))
    .filter((tool): tool is ToolCardItem => tool !== undefined)
    .slice(0, visibleRecentToolLimit);

  if (recentTools.length === 0) return null;

  return (
    <section
      aria-labelledby="recent-tools-title"
      className="mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 sm:pb-20 sm:pt-20 lg:px-8 lg:pb-24"
    >
      <div>
        <p className="section-eyebrow">Stored on this device</p>
        <h2 className="content-title mt-3" id="recent-tools-title">
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
