import Link from "next/link";

import { CategoryIcon } from "@/components/ui/icon";
import {
  getCategoryToolCounts,
  publishedCategories,
} from "@/lib/catalog/registry";
import type { CategorySlug } from "@/lib/catalog/types";

interface CatalogSidebarProps {
  currentCategory?: CategorySlug;
}

export function CatalogSidebar({ currentCategory }: CatalogSidebarProps) {
  const counts = getCategoryToolCounts();

  return (
    <aside
      aria-label="Tool categories"
      className="lg:sticky lg:top-20 lg:self-start"
    >
      <nav className="rounded-card border border-line bg-panel p-2">
        <p className="px-3 pb-2 pt-1 text-xs font-semibold uppercase tracking-wider text-ink-subtle">
          Categories
        </p>
        <ul className="grid gap-1 sm:grid-cols-2 lg:grid-cols-1">
          {publishedCategories.map((category) => (
            <li key={category.slug}>
              <Link
                aria-current={
                  currentCategory === category.slug ? "page" : undefined
                }
                className="flex min-h-11 items-center gap-3 rounded-control px-3 text-sm font-medium text-ink-muted hover:bg-panel-muted hover:text-ink aria-[current=page]:bg-accent-soft aria-[current=page]:text-accent"
                href={`/categories/${category.slug}`}
              >
                <CategoryIcon
                  className="size-4 shrink-0"
                  name={category.icon}
                />
                <span className="min-w-0 flex-1 truncate">{category.name}</span>
                <span className="text-xs tabular-nums text-ink-subtle">
                  {counts[category.slug]}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
