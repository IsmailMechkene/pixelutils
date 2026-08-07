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

const differences: readonly {
  icon: ActionIconId;
  title: string;
  description: string;
}[] = [
  {
    icon: "shield-check",
    title: "Private by default",
    description: "Inputs stay in your browser whenever the task can run there.",
  },
  {
    icon: "calendar-clock",
    title: "Fast to the answer",
    description:
      "Static pages and focused tool bundles keep repeat work quick.",
  },
  {
    icon: "circle-check",
    title: "No account friction",
    description:
      "Open a tool, finish the task, and leave without a sign-up flow.",
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

      <section className="relative z-10 border-b border-line">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div className="absolute left-1/2 top-[-360px] h-[620px] w-[880px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,var(--accent-soft)_0%,transparent_70%)] opacity-90" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-12 sm:px-6 sm:pb-16 sm:pt-16 lg:px-8 lg:pb-20">
          <div className="mx-auto max-w-4xl text-center">
            <p className="section-eyebrow inline-flex min-h-8 items-center rounded-full border border-line bg-panel/80 px-3">
              Fast · Private · No account
            </p>
            <h1 className="hero-title">
              Free browser tools for the tasks you need done now.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-ink-muted sm:text-lg">
              Format, convert, calculate, and create without an account. Most
              tools process your work directly on your device.
            </p>
          </div>

          <div className="mt-8 sm:mt-10" id="find-a-tool">
            <SearchShell
              categories={categoryRegistry.map(({ name, slug }) => ({
                name,
                slug,
              }))}
              tools={searchItems}
            />
          </div>

          <nav
            aria-label="Quick tool links"
            className="mx-auto mt-5 flex max-w-3xl flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm"
          >
            <span className="mr-1 text-xs font-medium text-ink-subtle">
              Try:
            </span>
            {displayedFeaturedTools.slice(0, 4).map((tool) => (
              <Link
                className="inline-flex min-h-9 items-center rounded-lg px-2.5 font-medium text-ink-muted hover:bg-panel-muted hover:text-ink"
                href={`/tools/${tool.slug}`}
                key={tool.slug}
              >
                {tool.name}
              </Link>
            ))}
          </nav>
        </div>
      </section>

      {displayedFeaturedTools.length > 0 ? (
        <section
          aria-labelledby="featured-tools-title"
          className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 sm:pt-16 lg:px-8"
        >
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="section-eyebrow">Good places to start</p>
              <h2 className="section-title" id="featured-tools-title">
                Featured tools
              </h2>
            </div>
            <a
              className="hidden min-h-11 items-center gap-2 rounded-lg text-sm font-semibold text-accent hover:text-accent-hover sm:inline-flex"
              href="#categories"
            >
              Browse by category
              <Icon className="size-4" name="arrow-right" />
            </a>
          </div>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {displayedFeaturedTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>
      ) : null}

      <section
        aria-labelledby="categories-title"
        className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8"
        id="categories"
      >
        <div className="max-w-2xl">
          <p className="section-eyebrow">Browse the collection</p>
          <h2 className="section-title" id="categories-title">
            Find tools by category
          </h2>
          <p className="mt-3 text-base leading-7 text-ink-muted">
            Jump straight into developer, text, encoding, calculator, design,
            and browser utility workflows.
          </p>
        </div>
        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categoryRegistry.map((category) => (
            <CategoryCard
              category={category}
              compact
              key={category.slug}
              toolCount={categoryToolCounts[category.slug]}
            />
          ))}
        </div>
      </section>

      {displayedPopularTools.length > 0 ? (
        <section
          aria-labelledby="popular-tools-title"
          className="border-y border-line bg-panel"
        >
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-[0.7fr_1.3fr] lg:gap-14 lg:px-8">
            <div className="max-w-md">
              <p className="section-eyebrow">Curated in the catalog</p>
              <h2 className="section-title" id="popular-tools-title">
                Popular tools
              </h2>
              <p className="mt-4 text-sm leading-6 text-ink-muted">
                A configurable editorial order for commonly useful tools—not a
                claim based on tracking or invented usage data.
              </p>
            </div>
            <ol className="grid gap-2 sm:grid-cols-2">
              {displayedPopularTools.map((tool) => (
                <li key={tool.slug}>
                  <Link
                    className="group flex min-h-16 items-center gap-3 rounded-card border border-line bg-canvas px-4 py-3 hover:border-line-strong"
                    href={`/tools/${tool.slug}`}
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-control bg-accent-soft text-accent">
                      <ToolIcon className="size-5" name={tool.icon} />
                    </span>
                    <span className="min-w-0 flex-1 text-sm font-semibold text-ink group-hover:text-accent">
                      {tool.name}
                    </span>
                    <Icon
                      className="size-4 shrink-0 text-ink-subtle"
                      name="arrow-right"
                    />
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      <AdSlot placement="content" />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid overflow-hidden rounded-card border border-line bg-panel lg:grid-cols-[1.05fr_0.95fr]">
          <div className="bg-accent-soft p-6 sm:p-8 lg:p-10">
            <span className="grid size-11 place-items-center rounded-card bg-accent text-accent-ink">
              <Icon className="size-5" name="shield-check" />
            </span>
            <p className="section-eyebrow mt-6">Browser processing</p>
            <h2 className="section-title max-w-lg">
              Your routine inputs should not need a round trip to a server.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-ink-muted">
              Every tool explains where its processing happens. Tool input,
              files, generated passwords, and outputs are never sent to
              analytics.
            </p>
            <Link
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-control bg-accent px-4 text-sm font-semibold text-accent-ink hover:bg-accent-hover"
              href="/privacy"
            >
              Read the privacy approach
              <Icon className="size-4" name="arrow-right" />
            </Link>
          </div>

          <div className="p-6 sm:p-8 lg:p-10">
            <p className="section-eyebrow">Why PixelUtils is different</p>
            <div className="mt-5 divide-y divide-line">
              {differences.map((difference) => (
                <article
                  className="flex gap-4 py-5 first:pt-0 last:pb-0"
                  key={difference.title}
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-control bg-panel-muted text-ink-muted">
                    <Icon className="size-4" name={difference.icon} />
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-ink">
                      {difference.title}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-ink-muted">
                      {difference.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
            <Link
              className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-semibold text-accent hover:text-accent-hover"
              href="/about"
            >
              How the site is built
              <Icon className="size-4" name="arrow-right" />
            </Link>
          </div>
        </div>
      </section>

      <FavoriteTools tools={publishedToolCards} />
      <RecentTools tools={publishedToolCards} />
    </>
  );
}
