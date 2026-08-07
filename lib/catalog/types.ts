import type { CategoryIconId, ToolIconId } from "@/lib/icons/types";

export const categorySlugs = [
  "developer",
  "text",
  "encoding",
  "web",
  "image-conversion",
  "security",
  "date-time",
  "calculators",
  "color-design",
] as const;

export type CategorySlug = (typeof categorySlugs)[number];

export type ToolStatus = "draft" | "published";

export const toolDataTypes = [
  "text",
  "structured-data",
  "number",
  "date",
  "file",
  "image",
] as const;

export type ToolDataType = (typeof toolDataTypes)[number];

export interface FaqEntry {
  readonly question: string;
  readonly answer: string;
}

export interface ToolExample {
  readonly name: string;
  readonly input: string;
  readonly output: string;
}

export interface SeoDefinition {
  readonly title: string;
  readonly description: string;
}

export interface ToolDefinition {
  readonly slug: string;
  readonly name: string;
  readonly shortDescription: string;
  readonly longDescription: string;
  readonly category: CategorySlug;
  readonly keywords: readonly string[];
  readonly searchAliases: readonly string[];
  readonly icon: ToolIconId;
  readonly relatedTools: readonly string[];
  readonly featured: boolean;
  readonly popularRank?: number;
  readonly privacyNote: string;
  readonly browserProcessing: boolean;
  readonly sensitive: boolean;
  readonly inputType: ToolDataType;
  readonly outputType: ToolDataType;
  readonly faqs: readonly FaqEntry[];
  readonly usageSteps: readonly string[];
  readonly examples: readonly ToolExample[];
  readonly publishedAt: string;
  readonly updatedAt: string;
  readonly seo: SeoDefinition;
  readonly status: ToolStatus;
}

export type ToolSearchItem = Pick<
  ToolDefinition,
  | "slug"
  | "name"
  | "shortDescription"
  | "category"
  | "keywords"
  | "searchAliases"
>;

export interface CategoryDefinition {
  readonly slug: CategorySlug;
  readonly name: string;
  readonly shortDescription: string;
  readonly description: string;
  readonly selectionGuide: string;
  readonly icon: CategoryIconId;
  readonly order: number;
}

export function defineTool<const T extends ToolDefinition>(tool: T): T {
  return tool;
}
