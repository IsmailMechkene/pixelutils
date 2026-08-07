import type { CategoryDefinition, ToolDefinition } from "./types";

export type RegistryIssueCode =
  | "duplicate-category-slug"
  | "duplicate-category-order"
  | "duplicate-tool-slug"
  | "duplicate-seo-title"
  | "duplicate-seo-description"
  | "invalid-slug"
  | "invalid-category"
  | "invalid-date"
  | "invalid-date-order"
  | "invalid-popular-rank"
  | "duplicate-popular-rank"
  | "missing-content"
  | "broken-related-tool"
  | "related-tool-unpublished"
  | "self-related-tool"
  | "duplicate-related-tool"
  | "draft-featured-tool"
  | "missing-workspace";

export interface RegistryValidationIssue {
  code: RegistryIssueCode;
  message: string;
  path: string;
}

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;

function isValidDate(value: string) {
  if (!isoDatePattern.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().startsWith(value);
}

function findDuplicates(values: readonly string[]) {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }

  return duplicates;
}

export function validateRegistry(
  categories: readonly CategoryDefinition[],
  tools: readonly ToolDefinition[],
  workspaceSlugs: readonly string[] = [],
): RegistryValidationIssue[] {
  const issues: RegistryValidationIssue[] = [];
  const categorySlugs = new Set(categories.map((category) => category.slug));
  const toolsBySlug = new Map(tools.map((tool) => [tool.slug, tool]));
  const availableWorkspaces = new Set(workspaceSlugs);

  for (const slug of findDuplicates(categories.map((category) => category.slug))) {
    issues.push({
      code: "duplicate-category-slug",
      message: `Category slug "${slug}" is used more than once.`,
      path: `categories.${slug}`,
    });
  }

  for (const order of findDuplicates(
    categories.map((category) => String(category.order)),
  )) {
    issues.push({
      code: "duplicate-category-order",
      message: `Category order "${order}" is used more than once.`,
      path: `categories.order.${order}`,
    });
  }

  for (const slug of findDuplicates(tools.map((tool) => tool.slug))) {
    issues.push({
      code: "duplicate-tool-slug",
      message: `Tool slug "${slug}" is used more than once.`,
      path: `tools.${slug}`,
    });
  }

  const publishedTools = tools.filter((tool) => tool.status === "published");

  for (const title of findDuplicates(publishedTools.map((tool) => tool.seo.title))) {
    issues.push({
      code: "duplicate-seo-title",
      message: `Published SEO title "${title}" is not unique.`,
      path: "tools.seo.title",
    });
  }

  for (const description of findDuplicates(
    publishedTools.map((tool) => tool.seo.description),
  )) {
    issues.push({
      code: "duplicate-seo-description",
      message: `Published SEO description "${description}" is not unique.`,
      path: "tools.seo.description",
    });
  }

  const rankedTools = tools.filter((tool) => tool.popularRank !== undefined);
  for (const rank of findDuplicates(
    rankedTools.map((tool) => String(tool.popularRank)),
  )) {
    issues.push({
      code: "duplicate-popular-rank",
      message: `Popular rank "${rank}" is used more than once.`,
      path: `tools.popularRank.${rank}`,
    });
  }

  for (const tool of tools) {
    const path = `tools.${tool.slug || "unknown"}`;

    if (!slugPattern.test(tool.slug)) {
      issues.push({
        code: "invalid-slug",
        message: `Tool slug "${tool.slug}" must use lowercase kebab-case.`,
        path: `${path}.slug`,
      });
    }

    if (!categorySlugs.has(tool.category)) {
      issues.push({
        code: "invalid-category",
        message: `Tool "${tool.slug}" references unknown category "${tool.category}".`,
        path: `${path}.category`,
      });
    }

    for (const [field, value] of [
      ["name", tool.name],
      ["shortDescription", tool.shortDescription],
      ["longDescription", tool.longDescription],
      ["privacyNote", tool.privacyNote],
      ["seo.title", tool.seo.title],
      ["seo.description", tool.seo.description],
    ] as const) {
      if (!value.trim()) {
        issues.push({
          code: "missing-content",
          message: `Tool "${tool.slug}" is missing ${field}.`,
          path: `${path}.${field}`,
        });
      }
    }

    if (tool.status === "published") {
      for (const [field, values] of [
        ["keywords", tool.keywords],
        ["usageSteps", tool.usageSteps],
        ["examples", tool.examples],
        ["faqs", tool.faqs],
      ] as const) {
        if (values.length === 0) {
          issues.push({
            code: "missing-content",
            message: `Published tool "${tool.slug}" requires ${field}.`,
            path: `${path}.${field}`,
          });
        }
      }
    }

    if (!isValidDate(tool.publishedAt)) {
      issues.push({
        code: "invalid-date",
        message: `Tool "${tool.slug}" has an invalid publication date.`,
        path: `${path}.publishedAt`,
      });
    }

    if (!isValidDate(tool.updatedAt)) {
      issues.push({
        code: "invalid-date",
        message: `Tool "${tool.slug}" has an invalid updated date.`,
        path: `${path}.updatedAt`,
      });
    }

    if (
      isValidDate(tool.publishedAt) &&
      isValidDate(tool.updatedAt) &&
      tool.updatedAt < tool.publishedAt
    ) {
      issues.push({
        code: "invalid-date-order",
        message: `Tool "${tool.slug}" is updated before it is published.`,
        path: `${path}.updatedAt`,
      });
    }

    if (
      tool.popularRank !== undefined &&
      (!Number.isInteger(tool.popularRank) || tool.popularRank < 1)
    ) {
      issues.push({
        code: "invalid-popular-rank",
        message: `Tool "${tool.slug}" has an invalid popular rank.`,
        path: `${path}.popularRank`,
      });
    }

    if (tool.status === "draft" && tool.featured) {
      issues.push({
        code: "draft-featured-tool",
        message: `Draft tool "${tool.slug}" cannot be featured.`,
        path: `${path}.featured`,
      });
    }

    if (tool.status === "published" && !availableWorkspaces.has(tool.slug)) {
      issues.push({
        code: "missing-workspace",
        message: `Published tool "${tool.slug}" has no lazy workspace loader.`,
        path: `${path}.workspace`,
      });
    }

    for (const relatedSlug of findDuplicates(tool.relatedTools)) {
      issues.push({
        code: "duplicate-related-tool",
        message: `Tool "${tool.slug}" repeats related tool "${relatedSlug}".`,
        path: `${path}.relatedTools`,
      });
    }

    for (const relatedSlug of tool.relatedTools) {
      if (relatedSlug === tool.slug) {
        issues.push({
          code: "self-related-tool",
          message: `Tool "${tool.slug}" cannot relate to itself.`,
          path: `${path}.relatedTools`,
        });
        continue;
      }

      const relatedTool = toolsBySlug.get(relatedSlug);
      if (!relatedTool) {
        issues.push({
          code: "broken-related-tool",
          message: `Tool "${tool.slug}" references unknown tool "${relatedSlug}".`,
          path: `${path}.relatedTools`,
        });
      } else if (
        tool.status === "published" &&
        relatedTool.status !== "published"
      ) {
        issues.push({
          code: "related-tool-unpublished",
          message: `Published tool "${tool.slug}" references unpublished tool "${relatedSlug}".`,
          path: `${path}.relatedTools`,
        });
      }
    }
  }

  return issues;
}

export function assertValidRegistry(
  categories: readonly CategoryDefinition[],
  tools: readonly ToolDefinition[],
  workspaceSlugs: readonly string[] = [],
) {
  const issues = validateRegistry(categories, tools, workspaceSlugs);
  if (issues.length === 0) return;

  const details = issues.map((issue) => `- ${issue.path}: ${issue.message}`).join("\n");
  throw new Error(`Invalid tool registry:\n${details}`);
}
