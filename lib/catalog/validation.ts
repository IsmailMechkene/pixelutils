import type { CategoryDefinition, ToolDefinition } from "./types";

export type RegistryIssueCode =
  | "duplicate-category-slug"
  | "duplicate-category-order"
  | "invalid-category-definition"
  | "duplicate-tool-slug"
  | "duplicate-tool-name"
  | "duplicate-seo-title"
  | "duplicate-seo-description"
  | "invalid-slug"
  | "invalid-category"
  | "invalid-date"
  | "invalid-date-order"
  | "invalid-popular-rank"
  | "invalid-search-weight"
  | "duplicate-popular-rank"
  | "invalid-publication-status"
  | "missing-content"
  | "broken-related-tool"
  | "related-tool-unpublished"
  | "self-related-tool"
  | "duplicate-related-tool"
  | "draft-featured-tool"
  | "missing-workspace"
  | "unknown-workspace"
  | "orphan-tool"
  | "broken-route";

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
  return (
    !Number.isNaN(parsed.valueOf()) && parsed.toISOString().startsWith(value)
  );
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

function normalized(value: string) {
  return value.normalize("NFKC").trim().toLowerCase();
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

  for (const slug of findDuplicates(
    categories.map((category) => category.slug),
  )) {
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

  for (const category of categories) {
    const path = `categories.${category.slug || "unknown"}`;
    if (!slugPattern.test(category.slug)) {
      issues.push({
        code: "invalid-category-definition",
        message: `Category slug "${category.slug}" must use lowercase kebab-case.`,
        path: `${path}.slug`,
      });
    }
    if (
      !/^\/categories\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(
        `/categories/${category.slug}`,
      )
    ) {
      issues.push({
        code: "broken-route",
        message: `Category "${category.slug}" cannot generate a valid canonical route.`,
        path: `${path}.slug`,
      });
    }
    if (!Number.isInteger(category.order) || category.order < 1) {
      issues.push({
        code: "invalid-category-definition",
        message: `Category "${category.slug}" must have a positive integer order.`,
        path: `${path}.order`,
      });
    }
    for (const [field, value] of [
      ["name", category.name],
      ["shortDescription", category.shortDescription],
      ["description", category.description],
      ["selectionGuide", category.selectionGuide],
    ] as const) {
      if (!value.trim()) {
        issues.push({
          code: "invalid-category-definition",
          message: `Category "${category.slug}" is missing ${field}.`,
          path: `${path}.${field}`,
        });
      }
    }
  }

  for (const slug of findDuplicates(tools.map((tool) => tool.slug))) {
    issues.push({
      code: "duplicate-tool-slug",
      message: `Tool slug "${slug}" is used more than once.`,
      path: `tools.${slug}`,
    });
  }

  for (const name of findDuplicates(
    tools.map((tool) => normalized(tool.name)),
  )) {
    issues.push({
      code: "duplicate-tool-name",
      message: `Tool name "${name}" is not unique.`,
      path: "tools.name",
    });
  }

  const publishedTools = tools.filter((tool) => tool.status === "published");

  for (const title of findDuplicates(
    publishedTools.map((tool) => normalized(tool.seo.title)),
  )) {
    issues.push({
      code: "duplicate-seo-title",
      message: `Published SEO title "${title}" is not unique.`,
      path: "tools.seo.title",
    });
  }

  for (const description of findDuplicates(
    publishedTools.map((tool) => normalized(tool.seo.description)),
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

    if (!/^\/tools\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(`/tools/${tool.slug}`)) {
      issues.push({
        code: "broken-route",
        message: `Tool "${tool.slug}" cannot generate a valid canonical route.`,
        path: `${path}.slug`,
      });
    }

    if (tool.status !== "draft" && tool.status !== "published") {
      issues.push({
        code: "invalid-publication-status",
        message: `Tool "${tool.slug}" has unsupported publication status "${String(tool.status)}".`,
        path: `${path}.status`,
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
        ["aliases", tool.aliases],
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

    if (
      !Number.isInteger(tool.searchWeight) ||
      tool.searchWeight < 0 ||
      tool.searchWeight > 100
    ) {
      issues.push({
        code: "invalid-search-weight",
        message: `Tool "${tool.slug}" must have an integer search weight from 0 to 100.`,
        path: `${path}.searchWeight`,
      });
    }

    if (tool.status === "draft" && tool.featured) {
      issues.push({
        code: "draft-featured-tool",
        message: `Draft tool "${tool.slug}" cannot be featured.`,
        path: `${path}.featured`,
      });
    }

    if (tool.status === "draft" && tool.popularRank !== undefined) {
      issues.push({
        code: "invalid-publication-status",
        message: `Draft tool "${tool.slug}" cannot have a popular rank.`,
        path: `${path}.popularRank`,
      });
    }

    if (tool.status === "published" && !categorySlugs.has(tool.category)) {
      issues.push({
        code: "orphan-tool",
        message: `Published tool "${tool.slug}" has no discoverable category route.`,
        path: `${path}.category`,
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

  for (const workspaceSlug of workspaceSlugs) {
    if (!toolsBySlug.has(workspaceSlug)) {
      issues.push({
        code: "unknown-workspace",
        message: `Workspace "${workspaceSlug}" has no registry definition.`,
        path: `workspaces.${workspaceSlug}`,
      });
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

  const details = issues
    .map((issue) => `- ${issue.path}: ${issue.message}`)
    .join("\n");
  throw new Error(`Invalid tool registry:\n${details}`);
}
