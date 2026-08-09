"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { Icon } from "@/components/ui/icon";
import { CustomSelect } from "@/components/ui/custom-select";
import {
  getNextSearchIndex,
  ALL_CATEGORIES,
  searchTools,
  type SearchNavigationKey,
} from "@/lib/catalog/search";
import type { ToolSearchItem } from "@/lib/catalog/types";
import { recordSearchQuery } from "@/lib/storage/catalog-preferences";
import { trackSearchPerformed } from "@/lib/analytics/client";
import type { CategorySlug } from "@/lib/catalog/types";

interface SearchShellProps {
  tools: readonly ToolSearchItem[];
  categories: readonly { readonly name: string; readonly slug: string }[];
}

export function SearchShell({ tools, categories }: SearchShellProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [category, setCategory] = useState<string>(ALL_CATEGORIES);
  const results = useMemo(
    () => searchTools(tools, query, { category }),
    [category, query, tools],
  );
  const categoryOptions = useMemo(
    () => [
      { value: ALL_CATEGORIES, label: "All categories" },
      ...categories.map(({ name, slug }, index) => ({
        value: slug,
        label: name,
        separatorBefore: index === 0,
      })),
    ],
    [categories],
  );
  const showResults = isOpen && Boolean(query);

  function selectWithKeyboard(key: SearchNavigationKey) {
    setActiveIndex((current) =>
      getNextSearchIndex(current, results.length, key),
    );
  }

  return (
    <div
      className="relative max-w-3xl"
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsOpen(false);
        }
      }}
    >
      <div className="relative">
        <Icon
          className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-ink-subtle"
          name="search"
        />
        <label className="sr-only" htmlFor="tool-search">
          Search tools
        </label>
        <input
          aria-activedescendant={
            activeIndex >= 0 && showResults
              ? `homepage-search-option-${activeIndex}`
              : undefined
          }
          aria-autocomplete="list"
          aria-controls={showResults ? "homepage-search-results" : undefined}
          aria-expanded={showResults}
          id="tool-search"
          className="h-14 w-full rounded-control border border-line-strong bg-panel py-3 pl-12 pr-16 font-mono text-base text-ink shadow-overlay outline-none placeholder:text-ink-subtle focus:border-accent sm:h-16 sm:text-lg"
          type="search"
          value={query}
          onChange={(event) => {
            const nextQuery = event.target.value;
            setQuery(nextQuery);
            setIsOpen(Boolean(nextQuery));
            setActiveIndex(
              nextQuery &&
                searchTools(tools, nextQuery, { category }).length > 0
                ? 0
                : -1,
            );
          }}
          onFocus={() => setIsOpen(Boolean(query))}
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
                recordSearchQuery(query);
                trackSearchPerformed({
                  surface: "homepage",
                  openedToolSlug: selected.slug,
                  categoryFilter:
                    category === ALL_CATEGORIES
                      ? undefined
                      : (category as CategorySlug),
                });
                router.push(`/tools/${selected.slug}`);
              }
            } else if (event.key === "Escape") {
              setIsOpen(false);
              setActiveIndex(-1);
            }
          }}
          placeholder="Search tools…"
          autoComplete="off"
          role="combobox"
        />
        <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-small border border-line bg-panel-muted px-2 py-1 font-mono text-xs font-medium text-ink-subtle sm:block">
          Ctrl K
        </kbd>
      </div>

      {showResults ? (
        <div
          id="homepage-search-results"
          className="search-results-scrollbar absolute inset-x-0 top-[calc(100%+8px)] z-30 max-h-80 overflow-y-auto rounded-control border border-line bg-panel p-2 shadow-overlay"
          aria-label="Tool search results"
          role="listbox"
        >
          {results.length > 0 ? (
            <ul role="presentation">
              {results.map((tool, index) => (
                <li key={tool.slug} role="presentation">
                  <Link
                    aria-selected={activeIndex === index}
                    className="flex min-h-14 items-center justify-between gap-3 rounded-lg px-3 py-2 hover:bg-panel-muted aria-selected:bg-panel-muted"
                    href={`/tools/${tool.slug}`}
                    id={`homepage-search-option-${index}`}
                    onClick={() => {
                      recordSearchQuery(query);
                      trackSearchPerformed({
                        surface: "homepage",
                        openedToolSlug: tool.slug,
                        categoryFilter:
                          category === ALL_CATEGORIES
                            ? undefined
                            : (category as CategorySlug),
                      });
                      setQuery("");
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
          ) : (
            <p className="px-3 py-4 text-sm text-ink-muted">
              No published tool matches “{query}”. The catalog is still growing.
            </p>
          )}
        </div>
      ) : null}

      <div className="mt-4 w-52 text-left">
        <CustomSelect
          appearance="compact"
          id="homepage-category-filter"
          label="Filter by category"
          leadingIcon="settings-2"
          onChange={(value) => {
            setCategory(value);
            setActiveIndex(
              query && searchTools(tools, query, { category: value }).length > 0
                ? 0
                : -1,
            );
          }}
          options={categoryOptions}
          value={category}
        />
      </div>

      <p aria-live="polite" aria-atomic="true" className="sr-only">
        {showResults
          ? `${results.length} ${results.length === 1 ? "tool" : "tools"} found.`
          : ""}
      </p>

      <p className="mt-2 text-xs text-ink-subtle">
        Search runs locally. Your query is not sent anywhere.
      </p>
    </div>
  );
}
