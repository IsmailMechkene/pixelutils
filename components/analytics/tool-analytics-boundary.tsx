"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";

import {
  trackCopyPerformed,
  trackDownloadPerformed,
  trackRelatedToolOpened,
  trackToolActionPerformed,
  trackToolViewed,
} from "@/lib/analytics/client";
import type {
  AnalyticsCopyTarget,
  AnalyticsDownloadKind,
  AnalyticsToolAction,
} from "@/lib/analytics/schema";
import type { CategorySlug } from "@/lib/catalog/types";

interface ToolAnalyticsContextValue {
  action(action: AnalyticsToolAction): void;
  copy(target: AnalyticsCopyTarget): void;
  download(kind: AnalyticsDownloadKind): void;
}

const ToolAnalyticsContext = createContext<
  ToolAnalyticsContextValue | undefined
>(undefined);

export function useToolAnalytics() {
  return useContext(ToolAnalyticsContext);
}

interface ToolAnalyticsBoundaryProps {
  readonly toolSlug: string;
  readonly category: CategorySlug;
  readonly children: ReactNode;
}

export function ToolAnalyticsBoundary({
  toolSlug,
  category,
  children,
}: ToolAnalyticsBoundaryProps) {
  const value = useMemo<ToolAnalyticsContextValue>(
    () => ({
      action: (action) =>
        void trackToolActionPerformed({ toolSlug, category, action }),
      copy: (target) => void trackCopyPerformed({ toolSlug, category, target }),
      download: (kind) =>
        void trackDownloadPerformed({ toolSlug, category, kind }),
    }),
    [category, toolSlug],
  );

  useEffect(() => {
    trackToolViewed({ toolSlug, category });

    function trackRelatedClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest<HTMLElement>("[data-related-tool-slug]");
      const targetToolSlug = link?.dataset.relatedToolSlug;
      if (targetToolSlug) {
        trackRelatedToolOpened({
          sourceToolSlug: toolSlug,
          targetToolSlug,
        });
      }
    }

    document.addEventListener("click", trackRelatedClick);
    return () => document.removeEventListener("click", trackRelatedClick);
  }, [category, toolSlug]);

  return (
    <ToolAnalyticsContext.Provider value={value}>
      {children}
    </ToolAnalyticsContext.Provider>
  );
}
