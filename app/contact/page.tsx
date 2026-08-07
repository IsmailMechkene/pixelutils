import type { Metadata } from "next";

import { siteConfig } from "@/lib/site";
import { createPageMetadata } from "@/lib/seo/metadata";
import { staticPageSeo } from "@/lib/seo/static-pages";

export const metadata: Metadata = createPageMetadata(staticPageSeo.contact);

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
        Contact
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-ink">
        Found something we should improve?
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-8 text-ink-muted">
        Send a concise description of the issue, the tool involved, and the browser
        you used. Do not email passwords, tokens, confidential files, or sensitive
        tool input.
      </p>
      <a
        className="mt-8 inline-flex min-h-11 items-center justify-center rounded-[10px] bg-accent px-5 text-sm font-semibold text-accent-ink hover:bg-accent-hover"
        href={`mailto:${siteConfig.contactEmail}?subject=PixelUtils%20feedback`}
      >
        Email {siteConfig.contactEmail}
      </a>
    </div>
  );
}
