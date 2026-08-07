import type { CategorySlug } from "@/lib/catalog/types";

export type AnalyticsToolAction =
  | "calculate"
  | "clear"
  | "convert"
  | "decode"
  | "encode"
  | "format"
  | "generate"
  | "minify"
  | "preview"
  | "remove-duplicates"
  | "reset"
  | "sample"
  | "swap"
  | "upload"
  | "validate";

export type AnalyticsCopyTarget = "input" | "output" | "result";
export type AnalyticsDownloadKind =
  "audio" | "document" | "image" | "text" | "video";
export type AnalyticsSearchSurface = "header" | "homepage";

interface ToolContext {
  readonly toolSlug: string;
  readonly category: CategorySlug;
}

export type AnalyticsEvent =
  | ({ readonly name: "tool_viewed" } & ToolContext)
  | ({
      readonly name: "tool_action_performed";
      readonly action: AnalyticsToolAction;
    } & ToolContext)
  | ({
      readonly name: "copy_performed";
      readonly target: AnalyticsCopyTarget;
    } & ToolContext)
  | ({
      readonly name: "download_performed";
      readonly kind: AnalyticsDownloadKind;
    } & ToolContext)
  | {
      readonly name: "search_performed";
      readonly surface: AnalyticsSearchSurface;
      readonly categoryFilter?: CategorySlug;
      readonly openedToolSlug: string;
    }
  | {
      readonly name: "related_tool_opened";
      readonly sourceToolSlug: string;
      readonly targetToolSlug: string;
    };

export interface AnalyticsProvider {
  readonly id: string;
  track(event: Readonly<AnalyticsEvent>): void;
}
