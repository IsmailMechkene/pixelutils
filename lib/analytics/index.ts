export {
  registerAnalyticsProvider,
  trackCopyPerformed,
  trackDownloadPerformed,
  trackRelatedToolOpened,
  trackSearchPerformed,
  trackToolActionPerformed,
  trackToolViewed,
} from "./client";
export type {
  AnalyticsCopyTarget,
  AnalyticsDownloadKind,
  AnalyticsEvent,
  AnalyticsProvider,
  AnalyticsSearchSurface,
  AnalyticsToolAction,
} from "./schema";
