import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo/metadata";
import { staticPageSeo } from "@/lib/seo/static-pages";

export const metadata: Metadata = createPageMetadata(staticPageSeo.terms);

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <p className="page-eyebrow">Terms</p>
      <h1 className="page-title">Terms of use</h1>
      <p className="mt-5 text-sm text-ink-subtle">
        Last updated: 7 August 2026
      </p>
      <div className="mt-8 space-y-8 text-base leading-8 text-ink-muted">
        <section>
          <h2 className="content-title">Using PixelUtils</h2>
          <p className="mt-3">
            PixelUtils provides free utilities for general informational and
            productivity purposes. You are responsible for checking that output
            is appropriate for your use case, especially where dates, security,
            financial decisions, or production data are involved.
          </p>
        </section>
        <section>
          <h2 className="content-title">Availability and accuracy</h2>
          <p className="mt-3">
            The site is provided as available without a guarantee that every
            browser, input, or use case will work without interruption. We aim
            to make limits and errors clear and to correct verified problems
            promptly.
          </p>
        </section>
        <section>
          <h2 className="content-title">Acceptable use</h2>
          <p className="mt-3">
            Do not use the site to break applicable law, interfere with service
            for others, or attempt to compromise the site or its hosting
            platform.
          </p>
        </section>
      </div>
    </article>
  );
}
