import Link from "next/link";

import { ToolIcon } from "@/components/ui/icon";
import type { ToolCardItem } from "@/lib/catalog/types";

interface PopularTasksProps {
  tools: readonly ToolCardItem[];
}

export function PopularTasks({ tools }: PopularTasksProps) {
  if (tools.length === 0) return null;

  return (
    <section aria-labelledby="popular-tasks-title" className="mt-10">
      <h2 className="content-title" id="popular-tasks-title">
        Popular tasks
      </h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {tools.map((tool) => (
          <Link
            className="group flex min-h-14 items-center gap-3 rounded-control border border-line bg-panel px-4 py-3 text-sm font-semibold text-ink transition-colors hover:border-accent hover:bg-panel-muted hover:text-accent"
            href={`/tools/${tool.slug}`}
            key={tool.slug}
            prefetch={false}
          >
            <span className="grid size-8 shrink-0 place-items-center rounded-control bg-accent-soft text-accent">
              <ToolIcon className="size-4" name={tool.icon} />
            </span>
            <span>{tool.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
