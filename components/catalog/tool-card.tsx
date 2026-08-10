import Link from "next/link";

import { ToolIcon } from "@/components/ui/icon";
import type { ToolCardItem } from "@/lib/catalog/types";

interface ToolCardProps {
  tool: ToolCardItem;
}

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <Link
      className="group flex h-full flex-col rounded-card border border-line bg-panel p-5 transition duration-150 hover:border-accent hover:bg-panel-muted"
      href={`/tools/${tool.slug}`}
      prefetch={false}
    >
      <div className="flex items-start justify-between gap-4">
        <span className="grid size-10 place-items-center rounded-control border border-line bg-panel-muted text-ink-muted">
          <ToolIcon className="size-5" name={tool.icon} />
        </span>
        {tool.browserProcessing ? (
          <span className="mono-label bg-success-soft px-2 py-1 text-success">
            Runs locally
          </span>
        ) : null}
      </div>
      <h3 className="mt-5 font-display text-lg font-bold tracking-tight text-ink group-hover:text-accent">
        {tool.name}
      </h3>
      <p className="mt-2 text-sm leading-6 text-ink-muted">
        {tool.shortDescription}
      </p>
    </Link>
  );
}
