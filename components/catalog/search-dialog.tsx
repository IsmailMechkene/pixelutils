"use client";

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
import {
  getNextSearchIndex,
  searchTools,
  type SearchNavigationKey,
} from "@/lib/catalog/search";
import type { ToolSearchItem } from "@/lib/catalog/types";

interface SearchDialogProps {
  tools: readonly ToolSearchItem[];
}

export function SearchDialog({ tools }: SearchDialogProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const results = useMemo(() => searchTools(tools, query), [query, tools]);

  function openDialog() {
    returnFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    setIsOpen(true);
    setActiveIndex(tools.length > 0 ? 0 : -1);
  }

  function closeDialog() {
    setIsOpen(false);
    setQuery("");
    setActiveIndex(tools.length > 0 ? 0 : -1);
    window.setTimeout(() => returnFocusRef.current?.focus(), 0);
  }

  function selectWithKeyboard(key: SearchNavigationKey) {
    setActiveIndex((current) =>
      getNextSearchIndex(current, results.length, key),
    );
  }

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        const homepageSearch = document.getElementById("tool-search");
        if (homepageSearch instanceof HTMLInputElement) {
          homepageSearch.focus();
          return;
        }
        returnFocusRef.current =
          document.activeElement instanceof HTMLElement
            ? document.activeElement
            : null;
        setIsOpen(true);
      }
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    inputRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  function handleDialogKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeDialog();
      return;
    }

    if (event.key !== "Tab") return;
    const focusable = Array.from(
      dialogRef.current?.querySelectorAll<HTMLElement>(
        "button:not([disabled]), input:not([disabled]), a[href]",
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

  return (
    <>
      <button
        className="hidden min-h-11 items-center gap-2 rounded-[10px] border border-line bg-panel px-3 text-sm font-medium text-ink-muted transition-colors duration-150 hover:border-line-strong hover:text-ink sm:inline-flex"
        onClick={openDialog}
        type="button"
      >
        <Icon className="size-4" name="search" />
        Search
        <kbd className="ml-1 rounded border border-line bg-panel-muted px-1.5 py-0.5 font-sans text-[10px] text-ink-subtle">
          Ctrl K
        </kbd>
      </button>
      <button
        className="inline-flex size-11 items-center justify-center rounded-[10px] border border-line bg-panel text-ink-muted transition-colors duration-150 hover:border-line-strong hover:text-ink sm:hidden"
        aria-label="Search tools"
        onClick={openDialog}
        type="button"
      >
        <Icon className="size-[18px]" name="search" />
      </button>

      {isOpen
        ? createPortal(
            <div
              className="fixed inset-0 z-[80] flex items-start justify-center bg-black/45 px-4 pt-[10vh] backdrop-blur-sm"
              onMouseDown={(event) => {
                if (event.currentTarget === event.target) closeDialog();
              }}
            >
              <div
                ref={dialogRef}
                aria-labelledby="search-dialog-title"
                aria-modal="true"
                className="w-full max-w-2xl overflow-hidden rounded-card border border-line bg-panel shadow-[0_28px_80px_rgba(0,0,0,0.28)]"
                onKeyDown={handleDialogKeyDown}
                role="dialog"
              >
                <div className="flex items-center gap-3 border-b border-line px-4">
                  <Icon
                    className="size-5 shrink-0 text-ink-subtle"
                    name="search"
                  />
                  <label
                    className="sr-only"
                    htmlFor="search-dialog-input"
                    id="search-dialog-title"
                  >
                    Search all tools
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
                    className="h-14 min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-ink-subtle"
                    id="search-dialog-input"
                    onChange={(event) => {
                      const nextQuery = event.target.value;
                      setQuery(nextQuery);
                      setActiveIndex(
                        searchTools(tools, nextQuery).length > 0 ? 0 : -1,
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
                        if (selected) {
                          closeDialog();
                          router.push(`/tools/${selected.slug}`);
                        }
                      }
                    }}
                    placeholder="Search tools…"
                    type="search"
                    value={query}
                    role="combobox"
                  />
                  <button
                    aria-label="Close search"
                    className="inline-flex size-11 shrink-0 items-center justify-center rounded-[10px] text-ink-muted hover:bg-panel-muted hover:text-ink"
                    onClick={closeDialog}
                    type="button"
                  >
                    <Icon className="size-5" name="close" />
                  </button>
                </div>
            <div
              className="max-h-[55vh] overflow-y-auto p-2"
              id="dialog-search-results"
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
                            id={`dialog-search-option-${index}`}
                            onClick={() => {
                              setIsOpen(false);
                              setQuery("");
                            }}
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
                    <div className="px-4 py-8 text-center">
                      <p className="text-sm font-medium text-ink">
                        {query
                          ? "No matching published tools"
                          : "No tools published yet"}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-ink-subtle">
                        Search runs locally and expands as tested tools are
                        published.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
