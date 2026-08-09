import type { Metadata } from "next";

import { TrustPageLayout } from "@/components/content/trust-page-layout";
import { createPageMetadata } from "@/lib/seo/metadata";
import { staticPageSeo } from "@/lib/seo/static-pages";

export const metadata: Metadata = createPageMetadata(staticPageSeo.about);

export default function AboutPage() {
  return (
    <TrustPageLayout
      eyebrow="About PixelUtils"
      sections={[
        { id: "purpose", label: "Why it exists" },
        { id: "principles", label: "Product principles" },
        { id: "how-tools-work", label: "How tools work" },
        { id: "publishing", label: "Publishing standard" },
        { id: "feedback", label: "Improving the site" },
      ]}
      summary="PixelUtils is a growing collection of small browser tools for getting a clear result without an account, a cluttered workflow, or an unnecessary upload."
      title="Small tools deserve thoughtful design."
    >
      <section id="purpose">
        <p className="section-eyebrow">01 / Why it exists</p>
        <h2 className="content-title">Useful work, without the detour.</h2>
        <p className="mt-3">
          Many everyday tasks are simple in principle: clean up JSON, convert a
          timestamp, generate a UUID, count words, or create a QR code. They
          should not require an account, a dashboard, or a confusing chain of
          uploads and redirects. PixelUtils focuses on making those jobs direct
          and understandable.
        </p>
      </section>

      <section className="border-t border-line pt-8" id="principles">
        <p className="section-eyebrow">02 / Product principles</p>
        <h2 className="content-title">A quiet utility should earn its place.</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {[
            ["Fast", "Open the tool and get to the task."],
            ["Private", "Keep ordinary inputs in the browser when possible."],
            ["Clear", "Explain limits, results, and next steps plainly."],
          ].map(([title, description]) => (
            <article className="rounded-card border border-line bg-panel p-4" key={title}>
              <p className="mono-label text-accent">{title}</p>
              <p className="mt-3 text-sm leading-6 text-ink-muted">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-line pt-8" id="how-tools-work">
        <p className="section-eyebrow">03 / How tools work</p>
        <h2 className="content-title">The interface stays close to the job.</h2>
        <p className="mt-3">
          Each published tool has a focused workspace, clear input and output
          labels, useful errors, and instructions that match the actual task.
          Tool code is kept separate from the shared interface so using one
          utility does not load every other tool in the catalog. Where a task
          can run in the browser, that processing boundary is stated on the
          page.
        </p>
      </section>

      <section className="border-t border-line pt-8" id="publishing">
        <p className="section-eyebrow">04 / Publishing standard</p>
        <h2 className="content-title">A route is not a finished tool.</h2>
        <p className="mt-3">
          A tool is published only after its core logic, validation, privacy
          boundary, accessibility, metadata, and edge cases have been reviewed.
          It must belong to a real category and connect to genuinely related
          tools. The goal is a dependable catalog, not the largest possible
          list of pages.
        </p>
      </section>

      <section className="border-t border-line pt-8" id="feedback">
        <p className="section-eyebrow">05 / Improving the site</p>
        <h2 className="content-title">Specific feedback is the most useful.</h2>
        <p className="mt-3">
          If a result is unclear, a browser behaves unexpectedly, or a tool is
          missing an important constraint, please report the tool name, what
          you expected, and what happened. Do not include passwords, tokens,
          confidential files, or sensitive input in feedback.
        </p>
      </section>
    </TrustPageLayout>
  );
}
