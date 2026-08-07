import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { AdSlot } from "@/components/ads/ad-slot";
import { JsonLd } from "@/components/seo/json-ld";
import { RelatedTools } from "@/components/tool-shell/related-tools";
import { ToolExamples } from "@/components/tool-shell/tool-examples";
import { ToolFAQ } from "@/components/tool-shell/tool-faq";
import { ToolHistory } from "@/components/tool-shell/tool-history";
import { ToolInstructions } from "@/components/tool-shell/tool-instructions";
import { ToolPageLayout } from "@/components/tool-shell/tool-page-layout";
import { ToolWorkspace } from "@/components/tool-shell/tool-workspace";
import { ToolWorkspaceRenderer } from "@/components/tool-shell/tool-workspace-renderer";
import { LoadingState } from "@/components/ui/states";
import {
  findCategory,
  findTool,
  getRelatedTools,
  publishedTools,
} from "@/lib/catalog/registry";
import { createToolMetadata } from "@/lib/seo/metadata";
import {
  createToolApplicationData,
  createToolBreadcrumbData,
  createToolFaqData,
} from "@/lib/seo/structured-data";

interface ToolPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return publishedTools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({
  params,
}: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = findTool(slug);
  return tool ? createToolMetadata(tool) : {};
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = findTool(slug);
  if (!tool) notFound();

  const category = findCategory(tool.category);
  if (!category) notFound();

  const relatedTools = getRelatedTools(tool);
  const faqData = createToolFaqData(tool);

  return (
    <>
      <JsonLd data={createToolApplicationData(tool)} />
      <JsonLd data={createToolBreadcrumbData(tool, category)} />
      {faqData ? <JsonLd data={faqData} /> : null}
      <ToolPageLayout category={category} tool={tool}>
        <ToolWorkspace>
          <Suspense fallback={<LoadingState label="Loading tool workspace" />}>
            <ToolWorkspaceRenderer category={tool.category} slug={tool.slug} />
          </Suspense>
        </ToolWorkspace>

        <div className="mt-14 grid gap-14">
          <ToolInstructions steps={tool.usageSteps} toolName={tool.name} />
          <ToolExamples examples={tool.examples} />
          <ToolFAQ entries={tool.faqs} />
          <RelatedTools tools={relatedTools} />
          <ToolHistory tool={tool} />
          <AdSlot placement="tool-after-content" />
        </div>
      </ToolPageLayout>
    </>
  );
}
