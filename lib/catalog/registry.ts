import { toolWorkspaceSlugs } from "@/tools/workspace-registry";

import type { CategoryDefinition, ToolDefinition } from "./types";
import { assertValidRegistry } from "./validation";

export const categoryRegistry = [
  {
    slug: "developer",
    name: "Developer",
    shortDescription: "Format, inspect, and transform developer data.",
    description:
      "Focused utilities for common development tasks, designed to keep pasted data in your browser.",
    icon: "code",
    order: 1,
  },
  {
    slug: "text",
    name: "Text",
    shortDescription: "Count, clean, and reshape written content.",
    description:
      "Straightforward text tools for writers, students, marketers, and anyone working with words.",
    icon: "text",
    order: 2,
  },
  {
    slug: "encoding",
    name: "Encoding",
    shortDescription: "Encode and decode common web formats.",
    description:
      "Browser-based encoders and decoders with clear errors and careful Unicode handling.",
    icon: "brackets",
    order: 3,
  },
  {
    slug: "security",
    name: "Security",
    shortDescription: "Generate and inspect sensitive values locally.",
    description:
      "Privacy-conscious security helpers built around modern browser cryptography and safe defaults.",
    icon: "shield",
    order: 4,
  },
  {
    slug: "date-time",
    name: "Date & Time",
    shortDescription: "Convert dates, timestamps, and durations.",
    description:
      "Accurate date and time utilities that explain time zones, units, and calendar assumptions.",
    icon: "clock",
    order: 5,
  },
  {
    slug: "calculators",
    name: "Calculators",
    shortDescription: "Solve everyday calculations without clutter.",
    description:
      "Clear calculators for common questions, with visible formulas and careful edge-case handling.",
    icon: "calculator",
    order: 6,
  },
  {
    slug: "color-design",
    name: "Color & Design",
    shortDescription: "Convert colors and prepare visual assets.",
    description:
      "Practical visual utilities with accessible output and local browser processing.",
    icon: "palette",
    order: 7,
  },
] as const satisfies readonly CategoryDefinition[];

// Add a complete definition only alongside its logic, tests, content, and lazy
// workspace loader. Drafts remain out of public selectors and generated routes.
export const toolRegistry = [] as const satisfies readonly ToolDefinition[];

assertValidRegistry(categoryRegistry, toolRegistry, toolWorkspaceSlugs);

const allTools: readonly ToolDefinition[] = toolRegistry;

export const publishedTools: readonly ToolDefinition[] = allTools.filter(
  (tool) => tool.status === "published",
);

export const featuredTools = publishedTools.filter((tool) => tool.featured);

export const popularTools = publishedTools
  .filter((tool) => tool.popularRank !== undefined)
  .toSorted((left, right) => (left.popularRank ?? 0) - (right.popularRank ?? 0));

export function findCategory(slug: string) {
  return categoryRegistry.find((category) => category.slug === slug);
}

export function findRegisteredTool(slug: string) {
  return allTools.find((tool) => tool.slug === slug);
}

export function findTool(slug: string) {
  return publishedTools.find((tool) => tool.slug === slug);
}

export function getToolsForCategory(categorySlug: string) {
  return publishedTools.filter((tool) => tool.category === categorySlug);
}

export function getRelatedTools(tool: ToolDefinition) {
  return tool.relatedTools
    .map(findTool)
    .filter((relatedTool): relatedTool is ToolDefinition => relatedTool !== undefined);
}

export function getToolCount(categorySlug?: string) {
  return categorySlug
    ? getToolsForCategory(categorySlug).length
    : publishedTools.length;
}

export function getCategoryToolCounts() {
  return Object.fromEntries(
    categoryRegistry.map((category) => [
      category.slug,
      getToolsForCategory(category.slug).length,
    ]),
  ) as Record<(typeof categoryRegistry)[number]["slug"], number>;
}
