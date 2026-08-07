export type AdPlacement =
  "category-content" | "homepage-content" | "sidebar" | "tool-after-content";

interface AdsEnvironment {
  readonly ADS_ENABLED?: string;
  readonly ADS_PROVIDER?: string;
  readonly AD_SLOT_CATEGORY_CONTENT?: string;
  readonly AD_SLOT_HOMEPAGE_CONTENT?: string;
  readonly AD_SLOT_SIDEBAR?: string;
  readonly AD_SLOT_TOOL_AFTER_CONTENT?: string;
}

export interface AdsConfig {
  readonly enabled: boolean;
  readonly providerId?: string;
  readonly slots: Readonly<Partial<Record<AdPlacement, string>>>;
}

export function resolveAdsConfig(environment: AdsEnvironment): AdsConfig {
  const providerId = environment.ADS_PROVIDER?.trim() || undefined;
  return {
    enabled: environment.ADS_ENABLED === "true" && Boolean(providerId),
    providerId,
    slots: {
      "category-content": environment.AD_SLOT_CATEGORY_CONTENT?.trim(),
      "homepage-content": environment.AD_SLOT_HOMEPAGE_CONTENT?.trim(),
      sidebar: environment.AD_SLOT_SIDEBAR?.trim(),
      "tool-after-content": environment.AD_SLOT_TOOL_AFTER_CONTENT?.trim(),
    },
  };
}

export const adsConfig = resolveAdsConfig({
  ADS_ENABLED: process.env.ADS_ENABLED,
  ADS_PROVIDER: process.env.ADS_PROVIDER,
  AD_SLOT_CATEGORY_CONTENT: process.env.AD_SLOT_CATEGORY_CONTENT,
  AD_SLOT_HOMEPAGE_CONTENT: process.env.AD_SLOT_HOMEPAGE_CONTENT,
  AD_SLOT_SIDEBAR: process.env.AD_SLOT_SIDEBAR,
  AD_SLOT_TOOL_AFTER_CONTENT: process.env.AD_SLOT_TOOL_AFTER_CONTENT,
});
