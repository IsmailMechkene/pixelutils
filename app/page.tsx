import Link from "next/link";

import { AdSlot } from "@/components/ads/ad-slot";
import { CategoryCard } from "@/components/catalog/category-card";
import { FavoriteTools } from "@/components/catalog/favorite-tools";
import { RecentTools } from "@/components/catalog/recent-tools";
import { SearchShell } from "@/components/catalog/search-shell";
import { ToolCard } from "@/components/catalog/tool-card";
import { JsonLd } from "@/components/seo/json-ld";
import { Icon, ToolIcon } from "@/components/ui/icon";
import {
  categoryRegistry,
  featuredTools,
  getCategoryToolCounts,
  popularTools,
  publishedToolCards,
  publishedTools,
} from "@/lib/catalog/registry";
import { createToolSearchItems } from "@/lib/catalog/search";
import type { ActionIconId } from "@/lib/icons/types";
import { getSiteUrl, siteConfig } from "@/lib/site";

const privacySignals: readonly {
  readonly icon: ActionIconId;
  readonly label: string;
  readonly detail: string;
}[] = [
  {
    icon: "monitor",
    label: "Browser processing",
    detail: "Most routine work stays in this tab.",
  },
  {
    icon: "shield-check",
    label: "No input analytics",
    detail: "Tool input and output are never analytics data.",
  },
  {
    icon: "key-round",
    label: "No account wall",
    detail: "Open a published tool and use it directly.",
  },
];

export default function HomePage() {
  const categoryToolCounts = getCategoryToolCounts();
  const searchItems = createToolSearchItems(publishedTools);
  const displayedFeaturedTools = featuredTools.slice(0, 6);
  const displayedPopularTools = popularTools.slice(0, 6);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: siteConfig.name,
          url: getSiteUrl().toString(),
          description: siteConfig.description,
        }}
      />

      <section className="border-b border-line">
        <div className="mx-auto max-w-7xl px-4 pb-14 pt-12 sm:px-6 sm:pb-16 sm:pt-16 lg:px-8 lg:pb-20">
          <div className="max-w-4xl">
            <p className="mono-label text-accent">Fast · Private · No account</p>
            <h1 className="hero-title">
              Free browser tools for the tasks you need done now.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-ink-muted sm:text-lg">
              Format, convert, calculate, and create without an account. Most
              tools process your work directly on your device.
            </p>
          </div>

          <div className="mt-8 sm:mt-10" id="find-a-tool">
            <SearchShell
              tools={searchItems}
            />
          </div>

          <nav aria-label="Quick tool links" className="mt-5">
            <p className="mono-label text-ink-subtle">Quick starts</p>
            <div className="mt-2 flex max-w-3xl flex-wrap gap-x-1 gap-y-2">
              {displayedFeaturedTools.slice(0, 4).map((tool) => (
                <Link
                  className="inline-flex min-h-10 items-center border-b border-transparent px-2 font-medium text-ink-muted hover:border-accent hover:text-ink"
                  href={`/tools/${tool.slug}`}
                  key={tool.slug}
                >
                  {tool.name}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </section>

      {displayedPopularTools.length > 0 ? (
        <section
          aria-labelledby="quick-starts-title"
          className="border-y border-line bg-panel"
        >
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[0.72fr_1.28fr] lg:gap-14 lg:px-8">
            <div className="max-w-md">
              <p className="section-eyebrow">Start with a useful tool</p>
              <h2 className="section-title" id="quick-starts-title">
                Good places to begin.
              </h2>
              <p className="mt-4 text-sm leading-6 text-ink-muted">
                An editorial set of common jobs, chosen for usefulness rather
                than implied tracking or popularity.
              </p>
            </div>
            <ol className="grid gap-2 sm:grid-cols-2">
              {displayedPopularTools.map((tool, index) => (
                <li key={tool.slug}>
                  <Link
                    className="group flex min-h-20 items-center gap-3 rounded-card border border-line bg-canvas px-4 py-3 hover:border-accent hover:bg-panel-muted"
                    href={`/tools/${tool.slug}`}
                  >
                    <span className="font-mono text-xs tabular-nums text-accent">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="grid size-9 shrink-0 place-items-center rounded-control border border-line bg-accent-soft text-accent">
                      <ToolIcon className="size-5" name={tool.icon} />
                    </span>
                    <span className="min-w-0 flex-1 text-sm font-semibold text-ink group-hover:text-accent">
                      {tool.name}
                    </span>
                    <Icon className="size-4 shrink-0 text-ink-subtle" name="arrow-right" />
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      {displayedFeaturedTools.length > 0 ? (
        <section
          aria-labelledby="featured-tools-title"
          className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8"
        >
          <div className="flex items-end justify-between gap-6 border-b border-line pb-4">
            <div>
              <p className="section-eyebrow">Selected utilities</p>
              <h2 className="section-title" id="featured-tools-title">
                Built for repeat work.
              </h2>
            </div>
            <a
              className="hidden min-h-11 items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-accent hover:text-accent-hover sm:inline-flex"
              href="#categories"
            >
              See the directory
              <Icon className="size-4" name="arrow-right" />
            </a>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {displayedFeaturedTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>
      ) : null}

      <section
        aria-labelledby="categories-title"
        className="border-y border-line bg-panel-muted/55"
        id="categories"
      >
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="grid gap-6 border-b border-line pb-6 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
            <div>
              <p className="section-eyebrow">Browse by workflow</p>
              <h2 className="section-title" id="categories-title">
                Find the right kind of tool.
              </h2>
            </div>
            <p className="max-w-2xl text-base leading-7 text-ink-muted">
              Jump directly into developer, text, encoding, security, date, or
              design work. Every published category leads to a crawlable list
              of its real tools.
            </p>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categoryRegistry.map((category) => (
              <CategoryCard
                category={category}
                compact
                key={category.slug}
                toolCount={categoryToolCounts[category.slug]}
              />
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <AdSlot placement="homepage-content" />
      </div>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="workbench-panel grid overflow-hidden rounded-card lg:grid-cols-[0.78fr_1.22fr]">
          <div className="bg-accent-soft p-6 sm:p-8 lg:p-10">
            <span className="grid size-11 place-items-center rounded-control border border-accent bg-accent text-accent-ink">
              <Icon className="size-5" name="shield-check" />
            </span>
            <p className="section-eyebrow mt-6">A calmer way to use utilities</p>
            <h2 className="section-title mt-3">
              Useful tools should stay out of your way.
            </h2>
            <p className="mt-4 text-base leading-7 text-ink-muted">
              Do the job, keep control of your data, and leave without a sign-up
              flow or a trail of unnecessary tracking.
            </p>
            <Link
              className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-control bg-accent px-4 font-mono text-xs font-semibold uppercase tracking-wider text-accent-ink hover:bg-accent-hover"
              href="/privacy"
            >
              Read the privacy approach
              <Icon className="size-4" name="arrow-right" />
            </Link>
          </div>

          <div className="p-6 sm:p-8 lg:p-10">
            <p className="mono-label text-ink-subtle">The practical bit</p>
            <div className="mt-5 grid divide-y divide-line border-y border-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {privacySignals.map((signal) => (
                <article className="p-4 first:pl-0 last:pr-0 sm:first:pl-0" key={signal.label}>
                  <span className="grid size-9 place-items-center rounded-control border border-line bg-panel-muted text-accent">
                    <Icon className="size-4" name={signal.icon} />
                  </span>
                  <h3 className="mt-5 text-sm font-semibold text-ink">
                    {signal.label}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-ink-muted">
                    {signal.detail}
                  </p>
                </article>
              ))}
            </div>
            <p className="mt-6 max-w-2xl text-sm leading-6 text-ink-muted">
              Each tool states its own processing boundary so you can make an
              informed choice before you use it.
            </p>
          </div>
        </div>
      </section>

      <FavoriteTools tools={publishedToolCards} />
      <RecentTools tools={publishedToolCards} />
    </>
  );
}
