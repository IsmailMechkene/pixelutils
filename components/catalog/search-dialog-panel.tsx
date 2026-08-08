"use client";

/* eslint-disable jsx-a11y/no-noninteractive-element-interactions -- The modal dialog boundary owns its focus trap. */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";

import { Icon } from "@/components/ui/icon";
import { CustomSelect } from "@/components/ui/custom-select";
import { EmptyState } from "@/components/ui/states";
import {
  getNextSearchIndex,
  groupSearchResults,
  isCatalogSearchIndex,
  ALL_CATEGORIES,
  searchTools,
  type SearchNavigationKey,
} from "@/lib/catalog/search";
import type { CatalogSearchIndex } from "@/lib/catalog/types";
import { recordSearchQuery } from "@/lib/storage/catalog-preferences";
import { trackSearchPerformed } from "@/lib/analytics/client";
import type { CategorySlug } from "@/lib/catalog/types";

import { RecentSearches } from "./recent-searches";
import { SearchResultsSkeleton } from "./search-dialog-skeleton";

interface SearchDialogPanelProps {
  onClose: (restoreFocus?: boolean) => void;
}

const emptyTools: CatalogSearchIndex["tools"] = [];
const emptyCategories: CatalogSearchIndex["categories"] = [];

export default function SearchDialogPanel({ onClose }: SearchDialogPanelProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>(ALL_CATEGORIES);
  const [catalog, setCatalog] = useState<CatalogSearchIndex>();
  const [loadError, setLoadError] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const queryRef = useRef("");
  const categoryRef = useRef<string>(ALL_CATEGORIES);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const tools = catalog?.tools ?? emptyTools;
  const categories = catalog?.categories ?? emptyCategories;
  const results = useMemo(
    () => searchTools(tools, query, { category }),
    [category, query, tools],
  );
  const groupedResults = useMemo(
    () => groupSearchResults(results, categories),
    [categories, results],
  );
  const categoryOptions = useMemo(
    () => [
      { value: ALL_CATEGORIES, label: "All categories" },
      ...categories.map(({ name, slug }) => ({ value: slug, label: name })),
    ],
    [categories],
  );

  function updateQuery(nextQuery: string) {
    queryRef.current = nextQuery;
    setQuery(nextQuery);
    setActiveIndex(
      searchTools(tools, nextQuery, { category }).length > 0 ? 0 : -1,
    );
  }

  function commitSearch(openedToolSlug: string) {
    if (query) recordSearchQuery(query);
    trackSearchPerformed({
      surface: "header",
      openedToolSlug,
      categoryFilter:
        category === ALL_CATEGORIES ? undefined : (category as CategorySlug),
    });
  }

  function selectWithKeyboard(key: SearchNavigationKey) {
    setActiveIndex((current) =>
      getNextSearchIndex(current, results.length, key),
    );
  }

  useEffect(() => {
    inputRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    async function loadCatalog() {
      try {
        const response = await fetch("/catalog-index.json", {
          credentials: "same-origin",
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Catalog index request failed.");
        const nextCatalog: unknown = await response.json();
        if (!isCatalogSearchIndex(nextCatalog)) {
          throw new Error("Catalog index is invalid.");
        }
        setCatalog(nextCatalog);
        setActiveIndex(
          searchTools(nextCatalog.tools, queryRef.current, {
            category: categoryRef.current,
          }).length > 0
            ? 0
            : -1,
        );
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError")
          return;
        setLoadError("Search could not load. Close the dialog and try again.");
      }
    }
    void loadCatalog();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (activeIndex < 0) return;
    document
      .getElementById(`dialog-search-option-${activeIndex}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  function handleDialogKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }

    if (event.key !== "Tab") return;
    const focusable = Array.from(
      dialogRef.current?.querySelectorAll<HTMLElement>(
        "button:not([disabled]), input:not([disabled]), a[href]:not([tabindex='-1'])",
      ) ?? [],
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm sm:p-6">
      <button
        aria-hidden="true"
        aria-label="Close search"
        className="absolute inset-0 cursor-default"
        onClick={() => onClose()}
        tabIndex={-1}
        type="button"
      />
      <div
        ref={dialogRef}
        aria-describedby="search-dialog-description"
        aria-labelledby="search-dialog-title"
        aria-modal="true"
        className="relative flex max-h-[calc(100dvh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-card border border-line bg-panel shadow-overlay"
        onKeyDown={handleDialogKeyDown}
        role="dialog"
      >
        <h2 className="sr-only" id="search-dialog-title">
          Search all tools
        </h2>
        <p className="sr-only" id="search-dialog-description">
          Search by tool name, keyword, or alias. Results stay in your browser.
        </p>
        <div className="group/search flex items-center gap-3 border-b border-line px-4 transition-colors focus-within:bg-panel-muted/50">
          <Icon
            className="size-5 shrink-0 text-ink-subtle transition-colors group-focus-within/search:text-accent"
            name="search"
          />
          <label className="sr-only" htmlFor="search-dialog-input">
            Search tools
          </label>
          <input
            aria-activedescendant={
              activeIndex >= 0
                ? `dialog-search-option-${activeIndex}`
                : undefined
            }
            aria-autocomplete="list"
            aria-controls="dialog-search-results"
            aria-expanded="true"
            ref={inputRef}
            autoComplete="off"
            className="search-dialog-input h-14 min-w-0 flex-1 bg-transparent text-base text-ink placeholder:text-ink-subtle"
            id="search-dialog-input"
            onChange={(event) => {
              const nextQuery = event.target.value;
              updateQuery(nextQuery);
            }}
            onKeyDown={(event) => {
              if (
                event.key === "ArrowDown" ||
                event.key === "ArrowUp" ||
                event.key === "Home" ||
                event.key === "End"
              ) {
                event.preventDefault();
                selectWithKeyboard(event.key);
              } else if (event.key === "Enter" && activeIndex >= 0) {
                event.preventDefault();
                const selected = results[activeIndex];
                if (selected) {
                  commitSearch(selected.slug);
                  onClose(false);
                  router.push(`/tools/${selected.slug}`);
                }
              }
            }}
            placeholder="Search tools…"
            role="combobox"
            type="search"
            value={query}
          />
          <button
            aria-label="Close search"
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-control text-ink-muted hover:bg-panel-muted hover:text-ink"
            onClick={() => onClose()}
            type="button"
          >
            <Icon className="size-4" name="x" />
          </button>
        </div>
        <div className="border-b border-line px-4 py-3">
          <CustomSelect
            className="max-w-xs"
            disabled={!catalog}
            id="search-category-filter"
            label="Category"
            onChange={(value) => {
              categoryRef.current = value;
              setCategory(value);
              setActiveIndex(
                searchTools(tools, query, { category: value }).length > 0
                  ? 0
                  : -1,
              );
            }}
            options={categoryOptions}
            value={category}
          />
        </div>
        {!query ? <RecentSearches onSelect={updateQuery} /> : null}
        <div
          aria-label="Tool search results"
          aria-busy={!catalog && !loadError}
          className="search-results-scrollbar min-h-0 flex-1 overflow-y-auto p-2"
          id="dialog-search-results"
          role={catalog && !loadError ? "listbox" : undefined}
        >
          {!catalog && !loadError ? (
            <SearchResultsSkeleton />
          ) : loadError ? (
            <EmptyState
              description={loadError}
              icon="triangle-alert"
              title="Search unavailable"
            />
          ) : results.length > 0 ? (
            <div className="grid gap-2">
              {groupedResults.map((group) => (
                <div
                  aria-labelledby={`search-group-${group.slug}`}
                  className="border-t border-line pt-2 first:border-t-0 first:pt-0"
                  key={group.slug}
                  role="group"
                >
                  <p
                    className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-ink-subtle"
                    id={`search-group-${group.slug}`}
                  >
                    {group.name}
                  </p>
                  <ul role="presentation">
                    {group.results.map(({ index, tool }) => (
                      <li key={tool.slug} role="presentation">
                        <Link
                          aria-selected={activeIndex === index}
                          className="flex min-h-14 items-center justify-between gap-3 rounded-lg px-3 py-2 hover:bg-panel-muted aria-selected:bg-panel-muted"
                          href={`/tools/${tool.slug}`}
                          id={`dialog-search-option-${index}`}
                          onClick={() => {
                            commitSearch(tool.slug);
                            onClose(false);
                          }}
                          onMouseEnter={() => setActiveIndex(index)}
                          role="option"
                          tabIndex={-1}
                        >
                          <span>
                            <span className="block text-sm font-semibold text-ink">
                              {tool.name}
                            </span>
                            <span className="mt-0.5 block text-xs text-ink-muted">
                              {tool.shortDescription}
                            </span>
                          </span>
                          <Icon
                            className="size-4 shrink-0 text-ink-subtle"
                            name="arrow-right"
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              description="Try another term or category. Search runs locally in this browser."
              title={
                query ? "No matching published tools" : "No tools published yet"
              }
            />
          )}
        </div>
        <p aria-live="polite" aria-atomic="true" className="sr-only">
          {`${results.length} ${results.length === 1 ? "tool" : "tools"} found.`}
        </p>
      </div>
    </div>,
    document.body,
  );
}
