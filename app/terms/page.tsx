import type { Metadata } from "next";

import { TrustPageLayout } from "@/components/content/trust-page-layout";
import { createPageMetadata } from "@/lib/seo/metadata";
import { staticPageSeo } from "@/lib/seo/static-pages";

export const metadata: Metadata = createPageMetadata(staticPageSeo.terms);

export default function TermsPage() {
  return (
    <TrustPageLayout
      eyebrow="Terms"
      sections={[
        { id: "using-pixelutils", label: "Using PixelUtils" },
        { id: "your-responsibility", label: "Your responsibility" },
        { id: "availability", label: "Availability" },
        { id: "acceptable-use", label: "Acceptable use" },
        { id: "third-parties", label: "Third parties" },
        { id: "changes", label: "Changes to terms" },
      ]}
      summary="These terms explain the straightforward rules for using PixelUtils: use the tools lawfully, verify results that matter, and help keep the service available for everyone."
      title="Terms of use"
      updated="7 August 2026"
    >
      <section id="using-pixelutils">
        <p className="section-eyebrow">01 / Using PixelUtils</p>
        <h2 className="content-title">Free utilities for ordinary tasks.</h2>
        <p className="mt-3">
          PixelUtils provides free browser utilities for general informational
          and productivity purposes. You may use the published tools for lawful
          personal or business work, provided that your use does not interfere
          with the site, its users, or its hosting platform.
        </p>
      </section>

      <section className="border-t border-line pt-8" id="your-responsibility">
        <p className="section-eyebrow">02 / Your responsibility</p>
        <h2 className="content-title">Check outputs before relying on them.</h2>
        <p className="mt-3">
          You are responsible for deciding whether a tool&apos;s output is suitable
          for your use case. Review results before using them in production,
          publishing them, or making decisions involving security, dates,
          finances, legal matters, safety, or other consequential situations.
          A convenient tool is not a substitute for professional advice or your
          own verification.
        </p>
      </section>

      <section className="border-t border-line pt-8" id="availability">
        <p className="section-eyebrow">03 / Availability</p>
        <h2 className="content-title">Provided as available.</h2>
        <p className="mt-3">
          We aim to keep the site fast, clear, and dependable, but cannot
          guarantee uninterrupted availability or compatibility with every
          browser, input, extension, network, or device. We work to make limits
          and errors clear and to correct verified problems when practical.
        </p>
      </section>

      <section className="border-t border-line pt-8" id="acceptable-use">
        <p className="section-eyebrow">04 / Acceptable use</p>
        <h2 className="content-title">Keep the service safe and usable.</h2>
        <p className="mt-3">
          Do not use PixelUtils to break applicable law, infringe another
          person&apos;s rights, interfere with service for others, probe or bypass
          security controls, overload the hosting platform, or attempt to
          compromise the site. Do not submit sensitive content to a tool unless
          you understand its stated processing boundary and accept that choice.
        </p>
      </section>

      <section className="border-t border-line pt-8" id="third-parties">
        <p className="section-eyebrow">05 / Third parties</p>
        <h2 className="content-title">Your browser and extensions are separate.</h2>
        <p className="mt-3">
          PixelUtils runs in your browser and is hosted by a third-party hosting
          platform. Your browser, extensions, downloads, network, and any other
          service you choose to use are governed by their own terms and privacy
          practices. The current application does not require an account,
          analytics provider, or advertising provider to use a published tool.
        </p>
      </section>

      <section className="border-t border-line pt-8" id="changes">
        <p className="section-eyebrow">06 / Changes to terms</p>
        <h2 className="content-title">The latest version is published here.</h2>
        <p className="mt-3">
          These terms may change as the product changes. Material changes will
          be published on this page with an updated date. Continuing to use the
          site after a revised version is published means you are using the site
          under the then-current terms.
        </p>
      </section>
    </TrustPageLayout>
  );
}
