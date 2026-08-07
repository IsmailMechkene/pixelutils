import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ToolCard } from "@/components/catalog/tool-card";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/tool-shell/breadcrumbs";
import { Icon } from "@/components/ui/icon";
import {
  findCategory,
  getToolsForCategory,
  publishedCategories,
} from "@/lib/catalog/registry";
import { createCategoryMetadata } from "@/lib/seo/metadata";
import {
  createCategoryBreadcrumbData,
  createCategoryCollectionData,
} from "@/lib/seo/structured-data";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return publishedCategories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = findCategory(categorySlug);

  if (!category || getToolsForCategory(category.slug).length === 0) return {};

  return createCategoryMetadata(category);
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const category = findCategory(categorySlug);
  if (!category) notFound();

  const tools = getToolsForCategory(category.slug);
  if (tools.length === 0) notFound();

  return (
    <>
      <JsonLd data={createCategoryCollectionData(category, tools)} />
      <JsonLd data={createCategoryBreadcrumbData(category)} />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <Breadcrumbs
          items={[{ href: "/", label: "Home" }, { label: category.name }]}
        />
        <header className="mt-7 max-w-3xl">
          <span className="grid size-11 place-items-center rounded-card bg-accent-soft text-accent">
            <Icon className="size-5" name={category.icon} />
          </span>
          <h1 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-ink sm:text-4xl">
            {category.name} tools
          </h1>
          <p className="mt-4 text-base leading-7 text-ink-muted sm:text-lg">
            {category.description}
          </p>
        </header>

        <section className="mt-10" aria-labelledby="category-tools-title">
          <h2 className="sr-only" id="category-tools-title">
            Available {category.name.toLocaleLowerCase()} tools
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
