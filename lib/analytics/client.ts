import { analyticsConfig } from "./config";
import type {
  AnalyticsCopyTarget,
  AnalyticsDownloadKind,
  AnalyticsEvent,
  AnalyticsProvider,
  AnalyticsSearchSurface,
  AnalyticsToolAction,
} from "./schema";
import type { CategorySlug } from "@/lib/catalog/types";

export function createAnalyticsDispatcher(
  enabled: boolean,
  getProvider: () => AnalyticsProvider | undefined,
) {
  return (event: AnalyticsEvent) => {
    if (!enabled) return false;
    const provider = getProvider();
    if (!provider) return false;
    provider.track(Object.freeze({ ...event }));
    return true;
  };
}

let registeredProvider: AnalyticsProvider | undefined;
const dispatch = createAnalyticsDispatcher(
  analyticsConfig.enabled,
  () => registeredProvider,
);

export function registerAnalyticsProvider(provider: AnalyticsProvider) {
  if (!analyticsConfig.enabled || provider.id !== analyticsConfig.providerId) {
    return () => undefined;
  }
  registeredProvider = provider;
  return () => {
    if (registeredProvider === provider) registeredProvider = undefined;
  };
}

export function trackToolViewed(properties: {
  toolSlug: string;
  category: CategorySlug;
}) {
  return dispatch({ name: "tool_viewed", ...properties });
}

export function trackToolActionPerformed(properties: {
  toolSlug: string;
  category: CategorySlug;
  action: AnalyticsToolAction;
}) {
  return dispatch({ name: "tool_action_performed", ...properties });
}

export function trackCopyPerformed(properties: {
  toolSlug: string;
  category: CategorySlug;
  target: AnalyticsCopyTarget;
}) {
  return dispatch({ name: "copy_performed", ...properties });
}

export function trackDownloadPerformed(properties: {
  toolSlug: string;
  category: CategorySlug;
  kind: AnalyticsDownloadKind;
}) {
  return dispatch({ name: "download_performed", ...properties });
}

export function trackSearchPerformed(properties: {
  surface: AnalyticsSearchSurface;
  categoryFilter?: CategorySlug;
  openedToolSlug: string;
}) {
  return dispatch({ name: "search_performed", ...properties });
}

export function trackRelatedToolOpened(properties: {
  sourceToolSlug: string;
  targetToolSlug: string;
}) {
  return dispatch({ name: "related_tool_opened", ...properties });
}
