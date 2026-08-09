import Link from "next/link";

import { CategoryIcon, Icon } from "@/components/ui/icon";
import type { CategoryDefinition } from "@/lib/catalog/types";

interface CategoryCardProps {
  category: CategoryDefinition;
  toolCount: number;
  compact?: boolean;
}

export function CategoryCard({
  category,
  toolCount,
  compact = false,
}: CategoryCardProps) {
  const content = (
    <>
      <span className="grid size-11 place-items-center rounded-control border border-line bg-panel-muted text-ink-muted">
        <CategoryIcon className="size-6" name={category.icon} />
      </span>
      <div className={compact ? "mt-5" : "mt-8"}>
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-display text-lg font-bold tracking-tight text-ink">
            {category.name}
          </h3>
          {toolCount > 0 ? (
            <Icon
              className="size-4 -translate-x-1 text-ink-subtle transition-transform duration-150 group-hover:translate-x-0 group-hover:text-accent"
              name="arrow-right"
            />
          ) : null}
        </div>
        <p className="mt-2 text-sm leading-6 text-ink-muted">
          {category.shortDescription}
        </p>
        <p className="mono-label mt-4 text-ink-subtle">
          {toolCount === 0
            ? "Tools in preparation"
            : `${toolCount} ${toolCount === 1 ? "tool" : "tools"}`}
        </p>
      </div>
    </>
  );

  const className = `group flex flex-col rounded-card border border-line bg-panel p-5 ${
    compact ? "min-h-0" : "min-h-52 sm:p-6"
  }`;

  return toolCount > 0 ? (
    <Link
      className={`${className} transition duration-150 hover:border-accent hover:bg-panel-muted`}
      href={`/categories/${category.slug}`}
    >
      {content}
    </Link>
  ) : (
    <article className={className}>{content}</article>
  );
}
