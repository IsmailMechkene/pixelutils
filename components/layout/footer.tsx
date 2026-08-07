import Link from "next/link";

import { categoryRegistry } from "@/lib/catalog/registry";

export function Footer() {
  return (
    <footer className="border-t border-line bg-panel">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.3fr_1fr_1fr] lg:px-8">
        <div className="max-w-sm">
          <p className="font-semibold tracking-[-0.02em] text-ink">PixelUtils</p>
          <p className="mt-3 text-sm leading-6 text-ink-muted">
            Thoughtful browser tools that put speed, clarity, and privacy first.
          </p>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-ink">Categories</h2>
          <ul className="mt-3 grid gap-1 text-sm text-ink-muted">
            {categoryRegistry.slice(0, 4).map((category) => (
              <li key={category.slug}>
                <Link
                  className="inline-flex min-h-11 items-center hover:text-ink"
                  href={`/categories/${category.slug}`}
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-ink">PixelUtils</h2>
          <ul className="mt-3 grid gap-1 text-sm text-ink-muted">
            {[
              ["About", "/about"],
              ["Privacy", "/privacy"],
              ["Terms", "/terms"],
              ["Contact", "/contact"],
            ].map(([label, href]) => (
              <li key={href}>
                <Link
                  className="inline-flex min-h-11 items-center hover:text-ink"
                  href={href}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-ink-subtle sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} PixelUtils.</p>
          <p>No account required. Tool data stays in your browser.</p>
        </div>
      </div>
    </footer>
  );
}
