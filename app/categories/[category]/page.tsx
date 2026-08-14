import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AdSlot } from "@/components/ads/ad-slot";
import { ToolCard } from "@/components/catalog/tool-card";
import { CatalogSidebar } from "@/components/catalog/catalog-sidebar";
import { PopularTasks } from "@/components/catalog/popular-tasks";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/tool-shell/breadcrumbs";
import { CategoryIcon } from "@/components/ui/icon";
import {
  findCategory,
  getPopularTasksForCategory,
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
  const popularTasks = getPopularTasksForCategory(category.slug);
  if (tools.length === 0) notFound();

  return (
    <>
      <JsonLd data={createCategoryCollectionData(category, tools)} />
      <JsonLd data={createCategoryBreadcrumbData(category)} />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <Breadcrumbs
          items={[{ href: "/", label: "Home" }, { label: category.name }]}
        />
        <div className="mt-7 grid gap-8 lg:grid-cols-[15rem_minmax(0,1fr)]">
          <CatalogSidebar currentCategory={category.slug} />
          <div className="min-w-0">
            <header className="max-w-3xl">
              <span className="grid size-11 place-items-center border border-accent bg-accent-soft text-accent">
                <CategoryIcon className="size-7" name={category.icon} />
              </span>
              <h1 className="page-title mt-5">{category.name} tools</h1>
              <p className="mt-4 text-base leading-7 text-ink-muted sm:text-lg">
                {category.description}
              </p>
            </header>

            <PopularTasks tools={popularTasks} />

            <section className="mt-10 border-t border-line pt-6" aria-labelledby="category-tools-title">
              <h2 className="content-title" id="category-tools-title">
                All {category.name.toLocaleLowerCase()} tools
              </h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {tools.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            </section>

            <div className="mt-12">
              <AdSlot placement="category-content" />
            </div>

            <section
              aria-labelledby="category-guide-title"
              className="mt-12 max-w-3xl border-t border-line pt-10"
            >
              <h2 className="content-title" id="category-guide-title">
                Choosing a {category.name.toLocaleLowerCase()} tool
              </h2>
              <p className="mt-3 text-base leading-7 text-ink-muted">
                {category.selectionGuide}
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
