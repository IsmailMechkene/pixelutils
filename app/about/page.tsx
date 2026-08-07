import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo/metadata";
import { staticPageSeo } from "@/lib/seo/static-pages";

export const metadata: Metadata = createPageMetadata(staticPageSeo.about);

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
        About PixelUtils
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-ink">
        Small tools deserve thoughtful design.
      </h1>
      <div className="mt-8 space-y-6 text-base leading-8 text-ink-muted">
        <p>
          PixelUtils is a collection of focused online utilities for everyday
          developer, text, encoding, security, date, calculation, and design tasks.
          It is being built around a simple idea: getting a small job done should
          not require an account, a confusing page, or an unnecessary upload.
        </p>
        <p>
          Tool interfaces are designed mobile-first and supported by clear
          instructions, useful errors, keyboard access, and tested transformation
          logic. Tool code is isolated so opening one utility does not load every
          other utility in the catalog.
        </p>
        <h2 className="pt-4 text-2xl font-semibold tracking-[-0.03em] text-ink">
          The standard for publishing
        </h2>
        <p>
          A tool is published only when its core logic, privacy boundary,
          accessibility, content, metadata, and edge cases have been reviewed.
          The goal is a useful catalog, not the largest possible list of pages.
        </p>
      </div>
    </article>
  );
}
