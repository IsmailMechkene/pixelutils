import { describe, expect, it } from "vitest";

import type { StorageLike } from "./tool-activity";
import {
  FAVORITE_TOOLS_STORAGE_KEY,
  normalizeStoredSearchQuery,
  parseFavoriteToolSlugs,
  parseSearchHistory,
  recordSearchQuery,
  SEARCH_HISTORY_STORAGE_KEY,
  setFavoriteTool,
} from "./catalog-preferences";

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

class ThrowingStorage implements StorageLike {
  getItem(): string | null {
    throw new Error("Storage is blocked");
  }
  setItem() {
    throw new Error("Storage is blocked");
  }
  removeItem() {
    throw new Error("Storage is blocked");
  }
}

describe("catalog preferences", () => {
  it("adds and removes favorite tool slugs without storing tool data", () => {
    const storage = new MemoryStorage();
    setFavoriteTool("json-formatter", true, storage);
    setFavoriteTool("word-character-counter", true, storage);
    setFavoriteTool("json-formatter", false, storage);

    expect(
      parseFavoriteToolSlugs(
        storage.getItem(FAVORITE_TOOLS_STORAGE_KEY) ?? "[]",
      ),
    ).toEqual(["word-character-counter"]);
  });

  it("stores normalized search terms only when a search is committed", () => {
    const storage = new MemoryStorage();
    recordSearchQuery("  JSON\n beautifier  ", storage);
    recordSearchQuery("json beautifier", storage);

    expect(
      parseSearchHistory(storage.getItem(SEARCH_HISTORY_STORAGE_KEY) ?? "[]"),
    ).toEqual(["json beautifier"]);
  });

  it("bounds and sanitizes stored search terms", () => {
    expect(
      normalizeStoredSearchQuery(`a\u0000${"b".repeat(100)}`),
    ).toHaveLength(80);
    expect(parseSearchHistory("not-json")).toEqual([]);
    expect(
      parseSearchHistory(
        JSON.stringify(["x".repeat(81), "valid query", "another query"]),
      ),
    ).toEqual(["valid query", "another query"]);
  });

  it("fails safely when browser storage access is blocked", () => {
    const storage = new ThrowingStorage();
    expect(setFavoriteTool("json-formatter", true, storage)).toBe(false);
    expect(recordSearchQuery("json formatter", storage)).toBe(false);
  });

  it("does not persist strings shaped like JWTs", () => {
    const storage = new MemoryStorage();
    expect(
      recordSearchQuery(
        "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.signaturevalue",
        storage,
      ),
    ).toBe(false);
    expect(storage.getItem(SEARCH_HISTORY_STORAGE_KEY)).toBeNull();
  });
});
