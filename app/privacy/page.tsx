import type { Metadata } from "next";

import { TrustPageLayout } from "@/components/content/trust-page-layout";
import { createPageMetadata } from "@/lib/seo/metadata";
import { staticPageSeo } from "@/lib/seo/static-pages";

export const metadata: Metadata = createPageMetadata(staticPageSeo.privacy);

export default function PrivacyPage() {
  return (
    <TrustPageLayout
      eyebrow="Privacy"
      sections={[
        { id: "plain-answer", label: "Plain answer" },
        { id: "tool-processing", label: "Tool processing" },
        { id: "local-storage", label: "Local storage" },
        { id: "analytics", label: "Analytics" },
        { id: "advertising", label: "Advertising" },
        { id: "hosting", label: "Hosting" },
        { id: "changes", label: "Changes" },
      ]}
      summary="PixelUtils is built so ordinary tool input can stay in your browser. This page explains what the current application stores, what it does not send, and what may change only with a policy update."
      title="Your work should remain yours."
      updated="7 August 2026"
    >
      <section id="plain-answer">
        <p className="section-eyebrow">01 / Plain answer</p>
        <h2 className="content-title">No account. No input upload by default.</h2>
        <p className="mt-3">
          PixelUtils does not ask you to create an account to use its published
          tools. The current application has no server endpoint for processing
          tool input or uploaded files. Each tool states its processing boundary
          clearly, so you can decide whether it fits your task before using it.
        </p>
      </section>

      <section className="border-t border-line pt-8" id="tool-processing">
        <p className="section-eyebrow">02 / Tool processing</p>
        <h2 className="content-title">Processing stays close to your device.</h2>
        <p className="mt-3">
          Published tools are designed to process input in the browser whenever
          technically possible. Formatting, conversion, generation, and similar
          work happen in the browser tab rather than being sent to PixelUtils.
          Browser extensions, downloads, or other software you choose to use
          are outside PixelUtils&apos;s control and may have their own policies.
        </p>
      </section>

      <section className="border-t border-line pt-8" id="local-storage">
        <p className="section-eyebrow">03 / Local storage</p>
        <h2 className="content-title">Small preferences, stored locally.</h2>
        <p className="mt-3">
          Your browser may store a theme preference, favorite and recently used
          tool identifiers, and search terms after you open a matching result.
          Search history can be cleared inside search. Optional activity history
          contains only fixed action labels and timestamps, never tool input or
          output, and is disabled by default for sensitive tools. You can remove
          this information at any time through your browser&apos;s site-data controls.
        </p>
      </section>

      <section className="border-t border-line pt-8" id="analytics">
        <p className="section-eyebrow">04 / Analytics</p>
        <h2 className="content-title">Not enabled in the current application.</h2>
        <p className="mt-3">
          No analytics provider is installed or configured. The analytics
          interface is disabled during local development and makes no requests
          when configuration or a provider adapter is absent. If analytics are
          enabled later, this notice will be updated first. It may receive only
          categorical events such as tool identifier, category, action name,
          search surface, or related-tool navigation.
        </p>
        <p className="mt-3">
          Analytics must never receive search text, tool input or output,
          uploaded files or filenames, passwords, JWTs, tokens, hashes,
          clipboard content, or full URLs.
        </p>
      </section>

      <section className="border-t border-line pt-8" id="advertising">
        <p className="section-eyebrow">05 / Advertising</p>
        <h2 className="content-title">No provider code or reserved ad space today.</h2>
        <p className="mt-3">
          Advertising and advertising-provider code are not enabled in the
          current application. Disabled ad slots render nothing and reserve no
          space, and the published ads.txt placeholder authorizes no sellers.
          Before advertising is enabled, this notice and any required consent
          controls will be updated. Ads will remain separate from tool controls
          and will not be required to use a tool.
        </p>
      </section>

      <section className="border-t border-line pt-8" id="hosting">
        <p className="section-eyebrow">06 / Hosting</p>
        <h2 className="content-title">Ordinary requests still reach the host.</h2>
        <p className="mt-3">
          Like any website, the hosting platform may process ordinary request
          data such as an IP address, requested path, user agent, and timestamp
          to serve and secure the site. PixelUtils does not use that data to
          inspect the content you enter into a tool.
        </p>
      </section>

      <section className="border-t border-line pt-8" id="changes">
        <p className="section-eyebrow">07 / Changes</p>
        <h2 className="content-title">Material changes will be visible here.</h2>
        <p className="mt-3">
          If a new tool needs a different processing boundary, or analytics or
          advertising is enabled, this page will be updated before that change
          is presented as part of the product. The date above identifies the
          latest published version of this notice.
        </p>
      </section>
    </TrustPageLayout>
  );
}
