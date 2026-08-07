interface AnalyticsEnvironment {
  readonly NODE_ENV?: string;
  readonly NEXT_PUBLIC_ANALYTICS_ENABLED?: string;
  readonly NEXT_PUBLIC_ANALYTICS_PROVIDER?: string;
}

export interface AnalyticsConfig {
  readonly enabled: boolean;
  readonly providerId?: string;
}

export function resolveAnalyticsConfig(
  environment: AnalyticsEnvironment,
): AnalyticsConfig {
  const providerId = environment.NEXT_PUBLIC_ANALYTICS_PROVIDER?.trim();
  const enabled =
    environment.NODE_ENV === "production" &&
    environment.NEXT_PUBLIC_ANALYTICS_ENABLED === "true" &&
    Boolean(providerId);

  return { enabled, providerId: providerId || undefined };
}

export const analyticsConfig = resolveAnalyticsConfig({
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_ANALYTICS_ENABLED: process.env.NEXT_PUBLIC_ANALYTICS_ENABLED,
  NEXT_PUBLIC_ANALYTICS_PROVIDER: process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER,
});
