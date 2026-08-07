export type ToolStatus = "draft" | "published";

export type ToolDataType =
  | "text"
  | "structured-data"
  | "number"
  | "date"
  | "file"
  | "image";

export interface FaqEntry {
  question: string;
  answer: string;
}

export interface ToolExample {
  name: string;
  input: string;
  output: string;
}

export interface SeoDefinition {
  title: string;
  description: string;
}

export interface ToolDefinition {
  slug: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  category: string;
  keywords: readonly string[];
  searchAliases: readonly string[];
  icon: string;
  relatedTools: readonly string[];
  featured: boolean;
  popularRank?: number;
  privacyNote: string;
  browserProcessing: boolean;
  sensitive: boolean;
  inputType: ToolDataType;
  outputType: ToolDataType;
  faqs: readonly FaqEntry[];
  usageSteps: readonly string[];
  examples: readonly ToolExample[];
  publishedAt: string;
  updatedAt: string;
  seo: SeoDefinition;
  status: ToolStatus;
}

export interface CategoryDefinition {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  icon: string;
  order: number;
}
