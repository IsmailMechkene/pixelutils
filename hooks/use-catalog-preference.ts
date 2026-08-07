"use client";

import { useSyncExternalStore } from "react";

import {
  getPreferenceSnapshot,
  subscribeToCatalogPreferences,
} from "@/lib/storage/catalog-preferences";

const emptySnapshot = "[]";

export function useCatalogPreferenceList(
  storageKey: string,
  parse: (snapshot: string) => string[],
) {
  const snapshot = useSyncExternalStore(
    subscribeToCatalogPreferences,
    () => getPreferenceSnapshot(storageKey),
    () => emptySnapshot,
  );
  return parse(snapshot);
}
