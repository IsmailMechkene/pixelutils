import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo/metadata";
import { staticPageSeo } from "@/lib/seo/static-pages";

export const metadata: Metadata = createPageMetadata(staticPageSeo.privacy);

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <p className="page-eyebrow">Privacy</p>
      <h1 className="page-title">Your work should remain yours.</h1>
      <p className="mt-5 text-sm text-ink-subtle">
        Last updated: 7 August 2026
      </p>
      <div className="mt-8 space-y-8 text-base leading-8 text-ink-muted">
        <section>
          <h2 className="content-title">Tool processing</h2>
          <p className="mt-3">
            PixelUtils is designed to process tool input in your browser
            whenever technically possible. Published tools state their
            processing boundary clearly. The current application does not
            provide server endpoints for processing tool input or uploaded
            files.
          </p>
        </section>
        <section>
          <h2 className="content-title">Local storage</h2>
          <p className="mt-3">
            Your browser may store your theme preference, favorite and recently
            used tool identifiers, and search terms only after you open a
            matching result. Search history can be cleared inside search.
            Optional activity history contains only fixed action labels and
            timestamps, never tool input or output. History is disabled by
            default for sensitive tools. You can clear browser storage at any
            time.
          </p>
        </section>
        <section>
          <h2 className="content-title">Analytics</h2>
          <p className="mt-3">
            No analytics provider is installed or configured in the current
            application. The analytics interface is disabled during local
            development and does not make requests when configuration or a
            provider adapter is absent. If enabled in a future deployment, it
            may receive only categorical events such as a tool identifier,
            category, action name, search surface, or related-tool navigation.
            It must never receive search text, tool input or output, uploaded
            files or filenames, passwords, JWTs, tokens, hashes, clipboard
            content, or full URLs.
          </p>
        </section>
        <section>
          <h2 className="content-title">Advertising</h2>
          <p className="mt-3">
            Advertisements and advertising provider code are not enabled in the
            current application. Disabled ad slots render nothing and reserve no
            space. The published ads.txt placeholder authorizes no sellers.
            Before advertising is enabled, this notice and any consent controls
            required for the selected provider and regions must be updated.
          </p>
        </section>
        <section>
          <h2 className="content-title">Hosting</h2>
          <p className="mt-3">
            Like any website, the hosting platform may process ordinary request
            data such as an IP address, requested path, user agent, and
            timestamp to serve and secure the site. PixelUtils does not use that
            data to inspect tool content.
          </p>
        </section>
      </div>
    </article>
  );
}
