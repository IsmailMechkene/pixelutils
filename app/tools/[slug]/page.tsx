import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ToolCard } from "@/components/catalog/tool-card";
import { JsonLd } from "@/components/seo/json-ld";
import { ToolPageLayout } from "@/components/tool-shell/tool-page-layout";
import { ToolWorkspace } from "@/components/tool-shell/tool-workspace";
import {
  findCategory,
  findTool,
  publishedTools,
} from "@/lib/catalog/registry";
import { getSiteUrl } from "@/lib/site";

interface ToolPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return publishedTools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = findTool(slug);
  if (!tool) return {};

  return {
    title: tool.seo.title,
    description: tool.seo.description,
    alternates: { canonical: `/tools/${tool.slug}` },
    openGraph: {
      title: tool.seo.title,
      description: tool.seo.description,
      url: `/tools/${tool.slug}`,
    },
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = findTool(slug);
  if (!tool) notFound();

  const category = findCategory(tool.category);
  if (!category) notFound();

  const relatedTools = tool.relatedTools
    .map(findTool)
    .filter((relatedTool) => relatedTool !== undefined);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: tool.name,
          description: tool.shortDescription,
          url: new URL(`/tools/${tool.slug}`, getSiteUrl()).toString(),
          applicationCategory: "UtilitiesApplication",
          operatingSystem: "Any modern web browser",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }}
      />
      <ToolPageLayout
        categoryName={category.name}
        relatedTools={
          relatedTools.length > 0 ? (
            <section aria-labelledby="related-tools-title">
              <h2
                className="text-2xl font-semibold tracking-[-0.03em] text-ink"
                id="related-tools-title"
              >
                Related tools
              </h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {relatedTools.map((relatedTool) => (
                  <ToolCard key={relatedTool.slug} tool={relatedTool} />
                ))}
              </div>
            </section>
          ) : null
        }
        tool={tool}
      >
        <ToolWorkspace>
          <p className="text-sm leading-6 text-ink-muted">
            The tool-specific client workspace is loaded here. Published tools
            replace this scaffold with an isolated, tested implementation.
          </p>
        </ToolWorkspace>
      </ToolPageLayout>
    </>
  );
}
