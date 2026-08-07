import { describe, expect, it, vi } from "vitest";

import { resolveAnalyticsConfig } from "./config";
import { createAnalyticsDispatcher } from "./client";
import type { AnalyticsProvider } from "./schema";

describe("analytics configuration", () => {
  it("is disabled without complete production configuration", () => {
    expect(resolveAnalyticsConfig({ NODE_ENV: "development" }).enabled).toBe(
      false,
    );
    expect(
      resolveAnalyticsConfig({
        NODE_ENV: "production",
        NEXT_PUBLIC_ANALYTICS_ENABLED: "true",
      }).enabled,
    ).toBe(false);
  });

  it("requires an explicit provider in production", () => {
    expect(
      resolveAnalyticsConfig({
        NODE_ENV: "production",
        NEXT_PUBLIC_ANALYTICS_ENABLED: "true",
        NEXT_PUBLIC_ANALYTICS_PROVIDER: "privacy-provider",
      }),
    ).toEqual({ enabled: true, providerId: "privacy-provider" });
  });
});

describe("analytics dispatcher", () => {
  it("does nothing when disabled or when no provider is registered", () => {
    const track = vi.fn();
    const provider: AnalyticsProvider = { id: "test", track };
    expect(
      createAnalyticsDispatcher(
        false,
        () => provider,
      )({
        name: "tool_viewed",
        toolSlug: "json-formatter",
        category: "developer",
      }),
    ).toBe(false);
    expect(
      createAnalyticsDispatcher(
        true,
        () => undefined,
      )({
        name: "search_performed",
        surface: "header",
        openedToolSlug: "json-formatter",
      }),
    ).toBe(false);
    expect(track).not.toHaveBeenCalled();
  });

  it("passes only the typed event envelope to a configured provider", () => {
    const track = vi.fn();
    const provider: AnalyticsProvider = { id: "test", track };
    const event = {
      name: "copy_performed" as const,
      toolSlug: "json-formatter",
      category: "developer" as const,
      target: "output" as const,
    };
    expect(createAnalyticsDispatcher(true, () => provider)(event)).toBe(true);
    expect(track).toHaveBeenCalledWith(event);
    expect(Object.isFrozen(track.mock.calls[0]?.[0])).toBe(true);
  });
});
