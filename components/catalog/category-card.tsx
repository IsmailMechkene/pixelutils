import Link from "next/link";

import { Icon } from "@/components/ui/icon";
import type { CategoryDefinition } from "@/lib/catalog/types";

interface CategoryCardProps {
  category: CategoryDefinition;
  toolCount: number;
}

export function CategoryCard({ category, toolCount }: CategoryCardProps) {
  return (
    <Link
      className="group flex min-h-52 flex-col rounded-card border border-line bg-panel p-5 transition-[border-color,box-shadow,transform] duration-150 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-[0_16px_36px_rgba(0,0,0,0.07)] sm:p-6"
      href={`/categories/${category.slug}`}
    >
      <span className="grid size-10 place-items-center rounded-[10px] bg-accent-soft text-accent">
        <Icon className="size-5" name={category.icon} />
      </span>
      <div className="mt-8">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold tracking-[-0.02em] text-ink">
            {category.name}
          </h3>
          <Icon
            className="size-4 -translate-x-1 text-ink-subtle transition-transform duration-150 group-hover:translate-x-0 group-hover:text-accent"
            name="arrow"
          />
        </div>
        <p className="mt-2 text-sm leading-6 text-ink-muted">
          {category.shortDescription}
        </p>
        <p className="mt-4 text-xs font-medium uppercase tracking-[0.12em] text-ink-subtle">
          {toolCount === 0
            ? "Tools in preparation"
            : `${toolCount} ${toolCount === 1 ? "tool" : "tools"}`}
        </p>
      </div>
    </Link>
  );
}
