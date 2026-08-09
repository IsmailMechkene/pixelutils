import type { CategoryDefinition, ToolDefinition } from "@/lib/catalog/types";
import type { GuideDefinition } from "@/lib/guides/types";
import { getSiteUrl } from "@/lib/site";

function absoluteUrl(path: string) {
  return new URL(path, getSiteUrl()).toString();
}

export function createToolApplicationData(tool: ToolDefinition) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.name,
    description: tool.shortDescription,
    url: absoluteUrl(`/tools/${tool.slug}`),
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any modern web browser",
    browserRequirements: "Requires JavaScript and a modern web browser",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    datePublished: tool.publishedAt,
    dateModified: tool.updatedAt,
  };
}

export function createToolBreadcrumbData(
  tool: ToolDefinition,
  category: CategoryDefinition,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: absoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: category.name,
        item: absoluteUrl(`/categories/${category.slug}`),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: tool.name,
        item: absoluteUrl(`/tools/${tool.slug}`),
      },
    ],
  };
}

export function createToolFaqData(tool: ToolDefinition) {
  if (tool.faqs.length === 0) return undefined;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: tool.faqs.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: entry.answer,
      },
    })),
  };
}

export function createCategoryCollectionData(
  category: CategoryDefinition,
  tools: readonly ToolDefinition[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${category.name} tools`,
    description: category.description,
    url: absoluteUrl(`/categories/${category.slug}`),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: tools.length,
      itemListElement: tools.map((tool, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: tool.name,
        url: absoluteUrl(`/tools/${tool.slug}`),
      })),
    },
  };
}

export function createCategoryBreadcrumbData(category: CategoryDefinition) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: absoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: category.name,
        item: absoluteUrl(`/categories/${category.slug}`),
      },
    ],
  };
}

export function createGuideArticleData(guide: GuideDefinition) {
  const canonical = `/guides/${guide.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    datePublished: guide.publishedAt,
    dateModified: guide.updatedAt,
    author: { "@type": "Organization", name: guide.byline },
    publisher: { "@type": "Organization", name: "PixelUtils" },
    mainEntityOfPage: absoluteUrl(canonical),
    url: absoluteUrl(canonical),
  };
}

export function createGuideBreadcrumbData(guide: GuideDefinition) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: absoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Guides",
        item: absoluteUrl("/guides"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: guide.title,
        item: absoluteUrl(`/guides/${guide.slug}`),
      },
    ],
  };
}
