import type { CategoryDefinition, ToolDefinition } from "./types";

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

// Tools are added only when their logic, UI, tests, content, and metadata are ready.
// Keeping this empty prevents unfinished utilities from becoming indexable placeholders.
export const toolRegistry: readonly ToolDefinition[] = [];

export const publishedTools = toolRegistry.filter(
  (tool) => tool.status === "published",
);

export function findCategory(slug: string) {
  return categoryRegistry.find((category) => category.slug === slug);
}

export function findTool(slug: string) {
  return publishedTools.find((tool) => tool.slug === slug);
}

export function getToolsForCategory(categorySlug: string) {
  return publishedTools.filter((tool) => tool.category === categorySlug);
}
