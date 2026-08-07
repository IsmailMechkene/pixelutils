import Link from "next/link";

import { ToolIcon } from "@/components/ui/icon";
import type { ToolCardItem } from "@/lib/catalog/types";

interface ToolCardProps {
  tool: ToolCardItem;
}

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <Link
      className="group flex h-full flex-col rounded-card border border-line bg-panel p-5 transition duration-150 hover:border-line-strong hover:shadow-card"
      href={`/tools/${tool.slug}`}
    >
      <div className="flex items-start justify-between gap-4">
        <span className="grid size-9 place-items-center rounded-control bg-panel-muted text-ink-muted">
          <ToolIcon className="size-6" name={tool.icon} />
        </span>
        {tool.browserProcessing ? (
          <span className="rounded-full bg-success-soft px-2.5 py-1 text-xs font-semibold text-success">
            Runs locally
          </span>
        ) : null}
      </div>
      <h3 className="mt-5 text-base font-semibold text-ink group-hover:text-accent">
        {tool.name}
      </h3>
      <p className="mt-2 text-sm leading-6 text-ink-muted">
        {tool.shortDescription}
      </p>
    </Link>
  );
}
