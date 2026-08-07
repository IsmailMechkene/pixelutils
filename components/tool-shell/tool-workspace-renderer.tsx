"use client";

import {
  lazy,
  Suspense,
  type ComponentType,
  type LazyExoticComponent,
} from "react";

import {
  toolWorkspaceLoaders,
  type ToolWorkspaceProps,
} from "@/tools/workspace-registry";

const lazyWorkspaces = Object.fromEntries(
  Object.entries(toolWorkspaceLoaders).map(([slug, loader]) => [
    slug,
    lazy(loader),
  ]),
) as Readonly<
  Record<string, LazyExoticComponent<ComponentType<ToolWorkspaceProps>>>
>;

export function ToolWorkspaceRenderer({ slug }: { slug: string }) {
  const Workspace = lazyWorkspaces[slug];

  if (!Workspace) {
    return (
      <p className="text-sm leading-6 text-ink-muted" role="alert">
        This tool workspace is not available. Published tools must register a
        lazy workspace loader.
      </p>
    );
  }

  return (
    <Suspense
      fallback={
        <div
          className="h-64 animate-pulse rounded-card bg-panel-muted motion-reduce:animate-none"
          role="status"
        >
          <span className="sr-only">Loading tool workspace</span>
        </div>
      }
    >
      <Workspace slug={slug} />
    </Suspense>
  );
}
