import type { ReactNode } from "react";

import { Icon } from "@/components/ui/icon";

interface TrustPageSection {
  readonly id: string;
  readonly label: string;
}

interface TrustPageLayoutProps {
  readonly eyebrow: string;
  readonly title: string;
  readonly summary: string;
  readonly updated?: string;
  readonly sections: readonly TrustPageSection[];
  readonly children: ReactNode;
}

export function TrustPageLayout({
  eyebrow,
  title,
  summary,
  updated,
  sections,
  children,
}: TrustPageLayoutProps) {
  return (
    <article className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-12">
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <nav className="workbench-panel rounded-card p-2" aria-label={`${eyebrow} page contents`}>
            <p className="mono-label border-b border-line px-3 pb-3 pt-2">Page map</p>
            <ol className="mt-2 grid gap-1">
              {sections.map((section, index) => (
                <li key={section.id}>
                  <a
                    className="flex min-h-11 items-center gap-3 rounded-control px-3 text-sm text-ink-muted transition-colors hover:bg-panel-muted hover:text-ink"
                    href={`#${section.id}`}
                  >
                    <span className="font-mono text-xs tabular-nums text-accent">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>{section.label}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>

        <div className="min-w-0 max-w-3xl">
          <header className="border-b border-line pb-8">
            <span className="grid size-11 place-items-center rounded-control border border-accent bg-accent-soft text-accent">
              <Icon className="size-5" name="info" />
            </span>
            <p className="section-eyebrow mt-6">{eyebrow}</p>
            <h1 className="page-title">{title}</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-ink-muted sm:text-lg">
              {summary}
            </p>
            {updated ? <p className="mono-label mt-6 text-ink-subtle">Updated {updated}</p> : null}
          </header>
          <div className="trust-page-content mt-8 space-y-10 text-base leading-8 text-ink-muted">
            {children}
          </div>
        </div>
      </div>
    </article>
  );
}
