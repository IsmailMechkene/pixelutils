"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { Icon } from "@/components/ui/icon";
import {
  getNextSearchIndex,
  searchTools,
  type SearchNavigationKey,
} from "@/lib/catalog/search";
import type { ToolSearchItem } from "@/lib/catalog/types";

interface SearchShellProps {
  tools: readonly ToolSearchItem[];
}

export function SearchShell({ tools }: SearchShellProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const results = useMemo(() => searchTools(tools, query), [query, tools]);

  function selectWithKeyboard(key: SearchNavigationKey) {
    setActiveIndex((current) =>
      getNextSearchIndex(current, results.length, key),
    );
  }

  return (
    <div className="relative mx-auto max-w-3xl">
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
            activeIndex >= 0
              ? `homepage-search-option-${activeIndex}`
              : undefined
          }
          aria-autocomplete="list"
          aria-controls={query ? "homepage-search-results" : undefined}
          aria-expanded={Boolean(query)}
          id="tool-search"
          className="h-14 w-full rounded-card border border-line-strong bg-panel py-3 pl-12 pr-16 text-base text-ink shadow-[0_14px_40px_rgba(0,0,0,0.07)] outline-none placeholder:text-ink-subtle focus:border-accent sm:h-16 sm:text-lg"
          type="search"
          value={query}
          onChange={(event) => {
            const nextQuery = event.target.value;
            setQuery(nextQuery);
            setActiveIndex(
              nextQuery && searchTools(tools, nextQuery).length > 0 ? 0 : -1,
            );
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
              if (selected) router.push(`/tools/${selected.slug}`);
            } else if (event.key === "Escape") {
              setQuery("");
              setActiveIndex(-1);
            }
          }}
          placeholder="Search tools…"
          autoComplete="off"
          role="combobox"
        />
        <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-line bg-panel-muted px-2 py-1 font-sans text-xs font-medium text-ink-subtle sm:block">
          Ctrl K
        </kbd>
      </div>

      {query ? (
        <div
          id="homepage-search-results"
          className="absolute inset-x-0 top-[calc(100%+8px)] z-30 max-h-80 overflow-y-auto rounded-card border border-line bg-panel p-2 shadow-[0_20px_55px_rgba(0,0,0,0.14)]"
          aria-live="polite"
          role="listbox"
        >
          {results.length > 0 ? (
            <ul>
              {results.map((tool, index) => (
                <li key={tool.slug} role="presentation">
                  <Link
                    aria-selected={activeIndex === index}
                    className="flex min-h-14 items-center justify-between gap-3 rounded-lg px-3 py-2 hover:bg-panel-muted aria-selected:bg-panel-muted"
                    href={`/tools/${tool.slug}`}
                    id={`homepage-search-option-${index}`}
                    onClick={() => setQuery("")}
                    onMouseEnter={() => setActiveIndex(index)}
                    role="option"
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
                      name="arrow"
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

      <p className="mt-3 text-center text-xs text-ink-subtle">
        Search runs locally. Your query is not sent anywhere.
      </p>
    </div>
  );
}
