import Link from "next/link";

import { AdSlot } from "@/components/ads/ad-slot";
import { CategoryCard } from "@/components/catalog/category-card";
import { RecentTools } from "@/components/catalog/recent-tools";
import { SearchShell } from "@/components/catalog/search-shell";
import { ToolCard } from "@/components/catalog/tool-card";
import { JsonLd } from "@/components/seo/json-ld";
import { Icon } from "@/components/ui/icon";
import {
  categoryRegistry,
  featuredTools,
  getCategoryToolCounts,
  popularTools,
  publishedTools,
} from "@/lib/catalog/registry";
import { getSiteUrl, siteConfig } from "@/lib/site";

const promises = [
  {
    icon: "shield",
    title: "Private by design",
    description:
      "Tool input stays on your device whenever the browser can do the work directly.",
  },
  {
    icon: "check",
    title: "Focused and accurate",
    description:
      "Clear inputs, useful errors, and tested logic without distracting account prompts.",
  },
  {
    icon: "clock",
    title: "Built to feel instant",
    description:
      "Static pages and small, isolated tool bundles keep the experience responsive.",
  },
];

export default function HomePage() {
  const categoryToolCounts = getCategoryToolCounts();

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
      <section className="relative overflow-hidden border-b border-line">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[-260px] h-[520px] w-[760px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,var(--accent-soft)_0%,transparent_68%)] opacity-80"
        />
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 sm:pb-20 sm:pt-20 lg:px-8 lg:pt-24">
          <div className="mx-auto max-w-4xl text-center">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Fast · Private · No account
            </p>
            <h1 className="text-4xl font-semibold tracking-[-0.045em] text-ink sm:text-5xl lg:text-[56px] lg:leading-[1.08]">
              Useful browser tools,
              <span className="block text-ink-muted">without the usual clutter.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-ink-muted sm:text-lg sm:leading-8">
              A focused collection of online utilities built to work quickly and
              keep your data on your device whenever possible.
            </p>
          </div>
          <div className="mt-10 sm:mt-12" id="find-a-tool">
            <SearchShell tools={publishedTools} />
          </div>
        </div>
      </section>

      {featuredTools.length > 0 ? (
        <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 sm:pt-20 lg:px-8" aria-labelledby="featured-tools-title">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
            Start here
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-ink" id="featured-tools-title">
            Featured tools
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>
      ) : null}

      <RecentTools tools={publishedTools} />

      <section
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
        id="categories"
        aria-labelledby="categories-title"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
              Explore
            </p>
            <h2
              className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-ink"
              id="categories-title"
            >
              Tools organized around the task
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-ink-muted">
              A calm catalog structure that makes the right utility easy to find
              as each tested tool is published.
            </p>
          </div>
          <Link
            className="inline-flex min-h-11 items-center gap-2 self-start rounded-lg text-sm font-semibold text-accent hover:text-accent-hover sm:self-auto"
            href="/about"
          >
            How PixelUtils is built
            <Icon className="size-4" name="arrow" />
          </Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categoryRegistry.map((category) => (
            <CategoryCard
              category={category}
              key={category.slug}
              toolCount={categoryToolCounts[category.slug]}
            />
          ))}
        </div>
      </section>

      {popularTools.length > 0 ? (
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8" aria-labelledby="popular-tools-title">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
            Curated order
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-ink" id="popular-tools-title">
            Popular tools
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {popularTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>
      ) : null}

      <AdSlot placement="content" />

      <section className="border-y border-line bg-panel">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                A better default
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-ink">
                The utility site, reconsidered.
              </h2>
              <p className="mt-4 max-w-lg text-base leading-7 text-ink-muted">
                No sign-up detours, no fake popularity counters, and no reason to
                upload routine input when your browser can process it safely.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {promises.map((promise) => (
                <article
                  className="rounded-card border border-line bg-canvas p-5"
                  key={promise.title}
                >
                  <span className="grid size-9 place-items-center rounded-[10px] bg-accent-soft text-accent">
                    <Icon className="size-[18px]" name={promise.icon} />
                  </span>
                  <h3 className="mt-5 text-base font-semibold text-ink">
                    {promise.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-ink-muted">
                    {promise.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="rounded-card border border-line bg-accent-soft px-6 py-8 sm:px-8 sm:py-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-semibold tracking-[-0.03em] text-ink">
                Privacy should be visible, not buried.
              </h2>
              <p className="mt-3 text-sm leading-6 text-ink-muted sm:text-base">
                Every tool will explain where processing happens. No tool input,
                uploaded file, generated password, or output is sent to analytics.
              </p>
            </div>
            <Link
              className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-[10px] bg-accent px-5 text-sm font-semibold text-accent-ink transition-colors duration-150 hover:bg-accent-hover"
              href="/privacy"
            >
              Read the privacy approach
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
