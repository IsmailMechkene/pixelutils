import { describe, expect, it } from "vitest";

import {
  getToolHistoryStorageKey,
  parseRecentToolSlugs,
  parseToolHistory,
  RECENT_TOOLS_STORAGE_KEY,
  RECENT_TOOL_LIMIT,
  recordRecentTool,
  recordToolHistory,
  TOOL_HISTORY_LIMIT,
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

  it("deduplicates and limits untrusted stored slugs", () => {
    const storedSlugs = Array.from(
      { length: RECENT_TOOL_LIMIT + 4 },
      (_, index) => `tool-${index}`,
    );
    expect(
      parseRecentToolSlugs(JSON.stringify([storedSlugs[0], ...storedSlugs])),
    ).toEqual(storedSlugs.slice(0, RECENT_TOOL_LIMIT));
  });
});

describe("tool history storage", () => {
  it("is disabled by default for sensitive tools", () => {
    const storage = new MemoryStorage();
    const stored = recordToolHistory("password-generator", "processed", {
      sensitive: true,
      storage,
      now: new Date("2026-08-07T12:00:00.000Z"),
    });

    expect(stored).toBe(false);
    expect(
      storage.getItem(getToolHistoryStorageKey("password-generator")),
    ).toBeNull();
  });

  it("stores action names and timestamps without content", () => {
    const storage = new MemoryStorage();
    recordToolHistory("json-formatter", "processed", {
      sensitive: false,
      storage,
      now: new Date("2026-08-07T12:00:00.000Z"),
    });

    const history = parseToolHistory(
      storage.getItem(getToolHistoryStorageKey("json-formatter")) ?? "[]",
    );
    expect(history).toHaveLength(1);
    expect(history[0]).toMatchObject({
      action: "processed",
      timestamp: "2026-08-07T12:00:00.000Z",
    });
    expect(JSON.stringify(history)).not.toContain("input");
    expect(JSON.stringify(history)).not.toContain("output");
  });

  it("drops unrecognized action values from browser storage", () => {
    expect(
      parseToolHistory(
        JSON.stringify([
          { action: "copied", timestamp: "2026-08-07T12:00:00.000Z" },
          { action: "user content", timestamp: "2026-08-07T12:00:00.000Z" },
        ]),
      ),
    ).toEqual([{ action: "copied", timestamp: "2026-08-07T12:00:00.000Z" }]);
  });

  it("rejects invalid dates and limits untrusted stored history", () => {
    const validEntries = Array.from(
      { length: TOOL_HISTORY_LIMIT + 10 },
      (_, index) => ({
        action: "processed",
        timestamp: new Date(Date.UTC(2026, 0, 1, 0, index)).toISOString(),
      }),
    );
    const parsed = parseToolHistory(
      JSON.stringify([
        ...validEntries,
        { action: "copied", timestamp: "not-a-date" },
      ]),
    );

    expect(parsed).toHaveLength(TOOL_HISTORY_LIMIT);
    expect(parsed).toEqual(validEntries.slice(0, TOOL_HISTORY_LIMIT));
  });
});
