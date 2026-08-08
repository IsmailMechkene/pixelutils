"use client";

import { Icon } from "@/components/ui/icon";
import { useCatalogPreferenceList } from "@/hooks/use-catalog-preference";
import {
  clearSearchHistory,
  parseSearchHistory,
  SEARCH_HISTORY_STORAGE_KEY,
} from "@/lib/storage/catalog-preferences";

interface RecentSearchesProps {
  onSelect: (query: string) => void;
}

export function RecentSearches({ onSelect }: RecentSearchesProps) {
  const searches = useCatalogPreferenceList(
    SEARCH_HISTORY_STORAGE_KEY,
    parseSearchHistory,
  );
  if (searches.length === 0) return null;

  return (
    <section
      aria-labelledby="recent-searches-title"
      className="search-results-scrollbar max-h-36 shrink-0 overflow-y-auto border-b border-line px-4 py-3"
    >
      <div className="flex items-center justify-between gap-3">
        <h3
          className="text-xs font-semibold text-ink-muted"
          id="recent-searches-title"
        >
          Recent searches
        </h3>
        <button
          className="min-h-8 rounded-control px-2 text-xs font-medium text-ink-subtle hover:bg-panel-muted hover:text-ink"
          onClick={() => clearSearchHistory()}
          type="button"
        >
          Clear
        </button>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {searches.map((query) => (
          <button
            className="inline-flex min-h-9 items-center gap-2 rounded-control border border-line bg-canvas px-3 text-xs font-medium text-ink-muted hover:border-line-strong hover:text-ink"
            key={query}
            onClick={() => onSelect(query)}
            type="button"
          >
            <Icon className="size-3.5" name="history" />
            <span className="truncate">{query}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
