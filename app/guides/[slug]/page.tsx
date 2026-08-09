import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { GuidePageLayout } from "@/components/content/guide-page-layout";
import { JsonLd } from "@/components/seo/json-ld";
import { findTool } from "@/lib/catalog/registry";
import type { ToolDefinition } from "@/lib/catalog/types";
import { findGuide, getRelatedGuides, publishedGuides } from "@/lib/guides/registry";
import { createGuideMetadata } from "@/lib/seo/metadata";
import { createGuideArticleData, createGuideBreadcrumbData } from "@/lib/seo/structured-data";

interface GuidePageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return publishedGuides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = findGuide(slug);
  return guide ? createGuideMetadata(guide) : {};
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = findGuide(slug);
  if (!guide) notFound();

  const primaryTool = findTool(guide.primaryToolSlug);
  if (!primaryTool) notFound();

  const relatedTools = guide.relatedToolSlugs.reduce<ToolDefinition[]>(
    (tools, toolSlug) => {
      const tool = findTool(toolSlug);
      if (tool) tools.push(tool);
      return tools;
    },
    [],
  );

  return (
    <>
      <JsonLd data={createGuideArticleData(guide)} />
      <JsonLd data={createGuideBreadcrumbData(guide)} />
      <GuidePageLayout
        guide={guide}
        primaryTool={primaryTool}
        relatedGuides={getRelatedGuides(guide)}
        relatedTools={relatedTools}
      >
        {guide.sections.map((section, index) => (
          <section id={section.id} key={section.id}>
            <p className="section-eyebrow">{String(index + 1).padStart(2, "0")} / Guide</p>
            <h2 className="content-title mt-3">{section.heading}</h2>
            <div className="mt-3 grid gap-3">
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            {section.steps ? (
              <ol className="mt-5 grid gap-3 border-l-2 border-accent pl-5 text-sm leading-6">
                {section.steps.map((step, stepIndex) => (
                  <li key={step}>
                    <span className="mr-2 font-mono text-xs text-accent">{String(stepIndex + 1).padStart(2, "0")}</span>
                    {step}
                  </li>
                ))}
              </ol>
            ) : null}
            {section.codeExample ? (
              <figure className="mt-5 overflow-hidden rounded-card border border-line bg-panel">
                <figcaption className="flex items-center justify-between gap-4 border-b border-line px-4 py-3 font-mono text-xs text-ink-muted">
                  <span>{section.codeExample.label}</span>
                  <span className="text-ink-subtle">{section.codeExample.language}</span>
                </figcaption>
                <pre className="overflow-x-auto p-4 text-sm leading-6 text-ink"><code>{section.codeExample.value}</code></pre>
              </figure>
            ) : null}
          </section>
        ))}
      </GuidePageLayout>
    </>
  );
}
