import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "How PixelUtils approaches local browser processing, storage, analytics, and advertising.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
        Privacy
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-ink">
        Your work should remain yours.
      </h1>
      <p className="mt-5 text-sm text-ink-subtle">Last updated: 7 August 2026</p>
      <div className="mt-8 space-y-8 text-base leading-8 text-ink-muted">
        <section>
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-ink">
            Tool processing
          </h2>
          <p className="mt-3">
            PixelUtils is designed to process tool input in your browser whenever
            technically possible. Published tools state their processing boundary
            clearly. The current application does not provide server endpoints for
            processing tool input or uploaded files.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-ink">
            Local storage
          </h2>
          <p className="mt-3">
            Your browser may store your theme preference. Future recently used tool
            history will contain tool identifiers only, not input or output. You can
            clear browser storage at any time.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-ink">
            Analytics and advertising
          </h2>
          <p className="mt-3">
            Analytics and advertising are not enabled in this scaffold. If either is
            configured in the future, this notice will be updated first. Tool input,
            files, output, passwords, tokens, and clipboard content must never be sent
            to analytics.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-ink">
            Hosting
          </h2>
          <p className="mt-3">
            Like any website, the hosting platform may process ordinary request data
            such as an IP address, requested path, user agent, and timestamp to serve
            and secure the site. PixelUtils does not use that data to inspect tool
            content.
          </p>
        </section>
      </div>
    </article>
  );
}
