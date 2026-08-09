import Link from "next/link";

import { Icon } from "@/components/ui/icon";

interface BreadcrumbItem {
  href?: string;
  label: string;
}

interface BreadcrumbsProps {
  items: readonly BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-wider text-ink-subtle">
        {items.map((item, index) => (
          <li
            className="flex items-center gap-2"
            key={`${item.label}-${index}`}
          >
            {index > 0 ? (
              <Icon
                className="size-3.5 shrink-0 text-ink-subtle"
                name="chevron-right"
              />
            ) : null}
            {item.href ? (
              <Link
                className="min-h-11 content-center hover:text-ink"
                href={item.href}
              >
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-ink-muted">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
