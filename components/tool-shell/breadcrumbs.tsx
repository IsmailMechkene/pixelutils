import Link from "next/link";

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
      <ol className="flex flex-wrap items-center gap-2 text-sm text-ink-subtle">
        {items.map((item, index) => (
          <li className="flex items-center gap-2" key={`${item.label}-${index}`}>
            {index > 0 ? <span aria-hidden="true">/</span> : null}
            {item.href ? (
              <Link className="min-h-11 content-center hover:text-ink" href={item.href}>
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
