import type { StorageLike } from "./tool-activity";

export const FAVORITE_TOOLS_STORAGE_KEY = "pixelutils:favorite-tools:v1";
export const SEARCH_HISTORY_STORAGE_KEY = "pixelutils:search-history:v1";
export const CATALOG_PREFERENCES_EVENT = "pixelutils:catalog-preferences";
export const FAVORITE_TOOL_LIMIT = 100;
export const SEARCH_HISTORY_LIMIT = 8;
export const SEARCH_QUERY_MAX_LENGTH = 80;

function resolveStorage(storage?: StorageLike) {
  if (storage) return storage;
  if (typeof window === "undefined") return undefined;
  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}

function parseStringList(snapshot: string, limit: number) {
  try {
    const value: unknown = JSON.parse(snapshot);
    if (!Array.isArray(value)) return [];
    return [
      ...new Set(
        value.filter(
          (entry): entry is string =>
            typeof entry === "string" && entry.length > 0,
        ),
      ),
    ].slice(0, limit);
  } catch {
    return [];
  }
}

function readStoredList(
  storage: StorageLike,
  key: string,
  parse: (snapshot: string) => string[],
) {
  try {
    return parse(storage.getItem(key) ?? "[]");
  } catch {
    return [];
  }
}

function writeList(
  key: string,
  values: readonly string[],
  storage?: StorageLike,
) {
  const resolvedStorage = resolveStorage(storage);
  if (!resolvedStorage) return false;
  try {
    resolvedStorage.setItem(key, JSON.stringify(values));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event(CATALOG_PREFERENCES_EVENT));
    }
    return true;
  } catch {
    return false;
  }
}

export function getPreferenceSnapshot(key: string) {
  const storage = resolveStorage();
  if (!storage) return "[]";
  try {
    return storage.getItem(key) ?? "[]";
  } catch {
    return "[]";
  }
}

export function subscribeToCatalogPreferences(callback: () => void) {
  if (typeof window === "undefined") return () => undefined;
  window.addEventListener("storage", callback);
  window.addEventListener(CATALOG_PREFERENCES_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CATALOG_PREFERENCES_EVENT, callback);
  };
}

export function parseFavoriteToolSlugs(snapshot: string) {
  return parseStringList(snapshot, FAVORITE_TOOL_LIMIT);
}

export function setFavoriteTool(
  slug: string,
  favorite: boolean,
  storage?: StorageLike,
) {
  const resolvedStorage = resolveStorage(storage);
  if (!resolvedStorage) return false;
  const current = readStoredList(
    resolvedStorage,
    FAVORITE_TOOLS_STORAGE_KEY,
    parseFavoriteToolSlugs,
  );
  const next = favorite
    ? [slug, ...current.filter((value) => value !== slug)].slice(
        0,
        FAVORITE_TOOL_LIMIT,
      )
    : current.filter((value) => value !== slug);
  return writeList(FAVORITE_TOOLS_STORAGE_KEY, next, resolvedStorage);
}

export function parseSearchHistory(snapshot: string) {
  try {
    const value: unknown = JSON.parse(snapshot);
    if (!Array.isArray(value)) return [];
    return [
      ...new Set(
        value.filter(
          (entry): entry is string =>
            typeof entry === "string" &&
            entry.length > 0 &&
            entry.length <= SEARCH_QUERY_MAX_LENGTH,
        ),
      ),
    ].slice(0, SEARCH_HISTORY_LIMIT);
  } catch {
    return [];
  }
}

export function normalizeStoredSearchQuery(query: string) {
  return query
    .normalize("NFKC")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, SEARCH_QUERY_MAX_LENGTH);
}

export function recordSearchQuery(query: string, storage?: StorageLike) {
  const normalizedQuery = normalizeStoredSearchQuery(query);
  const looksLikeJwt =
    /^[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}$/.test(
      normalizedQuery,
    );
  if (!normalizedQuery || looksLikeJwt) return false;
  const resolvedStorage = resolveStorage(storage);
  if (!resolvedStorage) return false;
  const current = readStoredList(
    resolvedStorage,
    SEARCH_HISTORY_STORAGE_KEY,
    parseSearchHistory,
  );
  const next = [
    normalizedQuery,
    ...current.filter(
      (value) =>
        value.toLocaleLowerCase() !== normalizedQuery.toLocaleLowerCase(),
    ),
  ].slice(0, SEARCH_HISTORY_LIMIT);
  return writeList(SEARCH_HISTORY_STORAGE_KEY, next, resolvedStorage);
}

export function clearSearchHistory(storage?: StorageLike) {
  const resolvedStorage = resolveStorage(storage);
  if (!resolvedStorage) return false;
  try {
    resolvedStorage.removeItem(SEARCH_HISTORY_STORAGE_KEY);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event(CATALOG_PREFERENCES_EVENT));
    }
    return true;
  } catch {
    return false;
  }
}
