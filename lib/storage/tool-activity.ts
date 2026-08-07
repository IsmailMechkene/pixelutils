export const RECENT_TOOLS_STORAGE_KEY = "pixelutils:recent-tools:v1";
export const TOOL_ACTIVITY_EVENT = "pixelutils:tool-activity";
const TOOL_HISTORY_PREFIX = "pixelutils:tool-history:v1:";
const recentToolLimit = 6;
const toolHistoryLimit = 20;

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface ToolHistoryEntry {
  action: ToolHistoryAction;
  timestamp: string;
}

export const toolHistoryActions = [
  "processed",
  "copied",
  "downloaded",
  "cleared",
  "sampled",
  "swapped",
] as const;

export type ToolHistoryAction = (typeof toolHistoryActions)[number];

function resolveStorage(storage?: StorageLike) {
  if (storage) return storage;
  if (typeof window === "undefined") return undefined;
  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}

function readStringArray(key: string, storage?: StorageLike): string[] {
  const resolvedStorage = resolveStorage(storage);
  if (!resolvedStorage) return [];

  try {
    const parsed: unknown = JSON.parse(resolvedStorage.getItem(key) ?? "[]");
    return Array.isArray(parsed)
      ? parsed.filter((value): value is string => typeof value === "string")
      : [];
  } catch {
    return [];
  }
}

function isHistoryEntry(value: unknown): value is ToolHistoryEntry {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<ToolHistoryEntry>;
  return (
    typeof candidate.action === "string" &&
    toolHistoryActions.includes(candidate.action as ToolHistoryAction) &&
    typeof candidate.timestamp === "string"
  );
}

function notifyActivityChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(TOOL_ACTIVITY_EVENT));
  }
}

export function getToolHistoryStorageKey(slug: string) {
  return `${TOOL_HISTORY_PREFIX}${slug}`;
}

export function getStorageSnapshot(key: string) {
  if (typeof window === "undefined") return "[]";
  try {
    return window.localStorage.getItem(key) ?? "[]";
  } catch {
    return "[]";
  }
}

export function subscribeToToolActivity(callback: () => void) {
  if (typeof window === "undefined") return () => undefined;

  window.addEventListener("storage", callback);
  window.addEventListener(TOOL_ACTIVITY_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(TOOL_ACTIVITY_EVENT, callback);
  };
}

export function parseRecentToolSlugs(snapshot: string) {
  try {
    const parsed: unknown = JSON.parse(snapshot);
    return Array.isArray(parsed)
      ? parsed.filter((value): value is string => typeof value === "string")
      : [];
  } catch {
    return [];
  }
}

export function recordRecentTool(slug: string, storage?: StorageLike) {
  const resolvedStorage = resolveStorage(storage);
  if (!resolvedStorage) return false;

  try {
    const current = readStringArray(RECENT_TOOLS_STORAGE_KEY, resolvedStorage);
    const next = [slug, ...current.filter((value) => value !== slug)].slice(
      0,
      recentToolLimit,
    );
    resolvedStorage.setItem(RECENT_TOOLS_STORAGE_KEY, JSON.stringify(next));
    notifyActivityChange();
    return true;
  } catch {
    return false;
  }
}

export function parseToolHistory(snapshot: string): ToolHistoryEntry[] {
  try {
    const parsed: unknown = JSON.parse(snapshot);
    return Array.isArray(parsed) ? parsed.filter(isHistoryEntry) : [];
  } catch {
    return [];
  }
}

export function recordToolHistory(
  slug: string,
  action: ToolHistoryAction,
  options: {
    sensitive: boolean;
    enabled?: boolean;
    storage?: StorageLike;
    now?: Date;
  },
) {
  const enabled = options.enabled ?? !options.sensitive;
  if (!enabled) return false;

  const resolvedStorage = resolveStorage(options.storage);
  if (!resolvedStorage) return false;
  const timestamp = (options.now ?? new Date()).toISOString();
  const entry: ToolHistoryEntry = {
    action,
    timestamp,
  };

  try {
    const key = getToolHistoryStorageKey(slug);
    const current = parseToolHistory(resolvedStorage.getItem(key) ?? "[]");
    resolvedStorage.setItem(
      key,
      JSON.stringify([entry, ...current].slice(0, toolHistoryLimit)),
    );
    notifyActivityChange();
    return true;
  } catch {
    return false;
  }
}

export function clearToolHistory(slug: string, storage?: StorageLike) {
  const resolvedStorage = resolveStorage(storage);
  if (!resolvedStorage) return false;

  try {
    resolvedStorage.removeItem(getToolHistoryStorageKey(slug));
    notifyActivityChange();
    return true;
  } catch {
    return false;
  }
}
