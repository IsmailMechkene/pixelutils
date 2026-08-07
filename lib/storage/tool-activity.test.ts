import { describe, expect, it } from "vitest";

import {
  getToolHistoryStorageKey,
  parseRecentToolSlugs,
  parseToolHistory,
  RECENT_TOOLS_STORAGE_KEY,
  recordRecentTool,
  recordToolHistory,
  type StorageLike,
} from "./tool-activity";

class MemoryStorage implements StorageLike {
  private values = new Map<string, string>();

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }

  removeItem(key: string) {
    this.values.delete(key);
  }
}

describe("recent tools storage", () => {
  it("stores only unique slugs in most-recent order", () => {
    const storage = new MemoryStorage();
    recordRecentTool("json-formatter", storage);
    recordRecentTool("base64", storage);
    recordRecentTool("json-formatter", storage);

    expect(
      parseRecentToolSlugs(storage.getItem(RECENT_TOOLS_STORAGE_KEY) ?? "[]"),
    ).toEqual(["json-formatter", "base64"]);
  });

  it("recovers safely from malformed storage", () => {
    expect(parseRecentToolSlugs("not-json")).toEqual([]);
  });
});

describe("tool history storage", () => {
  it("is disabled by default for sensitive tools", () => {
    const storage = new MemoryStorage();
    const stored = recordToolHistory("password-generator", "Generated password", {
      sensitive: true,
      storage,
      now: new Date("2026-08-07T12:00:00.000Z"),
    });

    expect(stored).toBe(false);
    expect(storage.getItem(getToolHistoryStorageKey("password-generator"))).toBeNull();
  });

  it("stores action names and timestamps without content", () => {
    const storage = new MemoryStorage();
    recordToolHistory("json-formatter", "Formatted JSON", {
      sensitive: false,
      storage,
      now: new Date("2026-08-07T12:00:00.000Z"),
    });

    const history = parseToolHistory(
      storage.getItem(getToolHistoryStorageKey("json-formatter")) ?? "[]",
    );
    expect(history).toHaveLength(1);
    expect(history[0]).toMatchObject({
      action: "Formatted JSON",
      timestamp: "2026-08-07T12:00:00.000Z",
    });
    expect(JSON.stringify(history)).not.toContain("input");
    expect(JSON.stringify(history)).not.toContain("output");
  });
});
