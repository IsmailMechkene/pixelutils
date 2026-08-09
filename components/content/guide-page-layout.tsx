import Link from "next/link";
import type { ReactNode } from "react";

import { Breadcrumbs } from "@/components/tool-shell/breadcrumbs";
import { Icon, ToolIcon } from "@/components/ui/icon";
import type { ToolDefinition } from "@/lib/catalog/types";
import type { GuideDefinition } from "@/lib/guides/types";

interface GuidePageLayoutProps {
  guide: GuideDefinition;
  primaryTool: ToolDefinition;
  relatedTools: readonly ToolDefinition[];
  relatedGuides: readonly GuideDefinition[];
  children: ReactNode;
}

export function GuidePageLayout({
  guide,
  primaryTool,
  relatedTools,
  relatedGuides,
  children,
}: GuidePageLayoutProps) {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/guides", label: "Guides" },
          { label: guide.title },
        ]}
      />

      <div className="mt-7 grid gap-10 lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-16">
        <article className="min-w-0 max-w-3xl">
          <header className="border-b border-line pb-8">
            <p className="section-eyebrow">{guide.category}</p>
            <h1 className="page-title mt-4">{guide.title}</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-ink-muted sm:text-lg">
              {guide.summary}
            </p>
            <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 font-mono text-xs text-ink-subtle">
              <span>By {guide.byline}</span>
              <span aria-hidden="true">/</span>
              <time dateTime={guide.updatedAt}>Updated {guide.updatedAt}</time>
              <span aria-hidden="true">/</span>
              <span>{guide.readingTime}</span>
            </div>
          </header>

          <div className="guide-content mt-10 grid gap-10 text-base leading-7 text-ink-muted">
            {children}
          </div>

          <section className="mt-12 border-t border-line pt-8" aria-labelledby="guide-tool-title">
            <p className="section-eyebrow">Try it locally</p>
            <div className="mt-4 rounded-card border border-line bg-panel p-5 sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-6">
              <div>
                <span className="grid size-10 place-items-center rounded-control border border-line bg-accent-soft text-accent">
                  <ToolIcon className="size-5" name={primaryTool.icon} />
                </span>
                <h2 className="content-title mt-4" id="guide-tool-title">
                  {primaryTool.name}
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-ink-muted">
                  {primaryTool.shortDescription}
                </p>
              </div>
              <Link
                className="mt-5 inline-flex min-h-11 shrink-0 items-center gap-2 rounded-control bg-accent px-4 font-mono text-xs font-semibold uppercase tracking-wider text-accent-ink hover:bg-accent-hover sm:mt-0"
                href={`/tools/${primaryTool.slug}`}
              >
                Open tool
                <Icon className="size-4" name="arrow-right" />
              </Link>
            </div>
          </section>

          {relatedTools.length > 0 ? (
            <section className="mt-12 border-t border-line pt-8" aria-labelledby="related-tools-title">
              <p className="section-eyebrow">Keep exploring</p>
              <h2 className="content-title mt-3" id="related-tools-title">Related tools</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {relatedTools.map((tool) => (
                  <Link
                    className="group flex min-h-20 items-center gap-3 rounded-card border border-line bg-panel p-4 hover:border-accent hover:bg-panel-muted"
                    href={`/tools/${tool.slug}`}
                    key={tool.slug}
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-control border border-line bg-accent-soft text-accent">
                      <ToolIcon className="size-5" name={tool.icon} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-ink group-hover:text-accent">{tool.name}</span>
                      <span className="mt-1 block text-xs leading-5 text-ink-muted">{tool.shortDescription}</span>
                    </span>
                    <Icon className="size-4 shrink-0 text-ink-subtle" name="arrow-right" />
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          {relatedGuides.length > 0 ? (
            <section className="mt-12 border-t border-line pt-8" aria-labelledby="related-guides-title">
              <p className="section-eyebrow">Read next</p>
              <h2 className="content-title mt-3" id="related-guides-title">Related guides</h2>
              <div className="mt-5 grid gap-3">
                {relatedGuides.map((relatedGuide) => (
                  <Link
                    className="group flex items-center justify-between gap-4 rounded-card border border-line bg-panel p-4 hover:border-accent hover:bg-panel-muted"
                    href={`/guides/${relatedGuide.slug}`}
                    key={relatedGuide.slug}
                  >
                    <span>
                      <span className="block text-sm font-semibold text-ink group-hover:text-accent">{relatedGuide.title}</span>
                      <span className="mt-1 block text-xs text-ink-muted">{relatedGuide.readingTime}</span>
                    </span>
                    <Icon className="size-4 shrink-0 text-ink-subtle" name="arrow-right" />
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </article>

        <aside className="lg:pt-2">
          <div className="rounded-card border border-line bg-panel p-4 lg:sticky lg:top-24">
            <p className="mono-label text-ink">In this guide</p>
            <nav aria-label="On this page" className="mt-3">
              <ol className="grid gap-1">
                {guide.sections.map((section, index) => (
                  <li key={section.id}>
                    <a
                      className="block rounded-control px-2 py-2 text-sm leading-5 text-ink-muted hover:bg-panel-muted hover:text-ink"
                      href={`#${section.id}`}
                    >
                      <span className="mr-2 font-mono text-xs text-accent">{String(index + 1).padStart(2, "0")}</span>
                      {section.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </aside>
      </div>
    </main>
  );
}
