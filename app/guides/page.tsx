import type { Metadata } from "next";

import { GuideCard } from "@/components/content/guide-card";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/tool-shell/breadcrumbs";
import { createPageMetadata } from "@/lib/seo/metadata";
import { staticPageSeo } from "@/lib/seo/static-pages";
import { getSiteUrl } from "@/lib/site";
import { publishedGuides } from "@/lib/guides/registry";

export const metadata: Metadata = createPageMetadata(staticPageSeo.guides);

export default function GuidesPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "PixelUtils guides",
          description: staticPageSeo.guides.description,
          url: new URL("/guides", getSiteUrl()).toString(),
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: publishedGuides.length,
            itemListElement: publishedGuides.map((guide, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: guide.title,
              url: new URL(`/guides/${guide.slug}`, getSiteUrl()).toString(),
            })),
          },
        }}
      />
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Guides" }]} />
      <header className="mt-7 max-w-3xl">
        <p className="section-eyebrow">PixelUtils guides</p>
        <h1 className="page-title mt-4">Useful context for the job at hand.</h1>
        <p className="mt-5 text-base leading-7 text-ink-muted sm:text-lg">
          Practical explanations, examples, and privacy-aware workflows for the tools you use every day.
        </p>
      </header>

      <section className="mt-10 border-t border-line pt-6" aria-labelledby="all-guides-title">
        <h2 className="sr-only" id="all-guides-title">All guides</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          {publishedGuides.map((guide) => <GuideCard guide={guide} key={guide.slug} />)}
        </div>
      </section>
    </main>
  );
}
