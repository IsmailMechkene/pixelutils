"use client";

import { lazy, Suspense, useEffect, useRef, useState } from "react";

import { Icon } from "@/components/ui/icon";
import type { ToolSearchItem } from "@/lib/catalog/types";

const SearchDialogPanel = lazy(() => import("./search-dialog-panel"));

interface SearchDialogProps {
  tools: readonly ToolSearchItem[];
  categories: readonly { readonly name: string; readonly slug: string }[];
}

export function SearchDialog({ tools, categories }: SearchDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  function openDialog() {
    returnFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    setIsOpen(true);
  }

  function closeDialog(restoreFocus = true) {
    setIsOpen(false);
    if (restoreFocus) {
      window.setTimeout(() => returnFocusRef.current?.focus(), 0);
    }
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

  return (
    <>
      <button
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className="hidden min-h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium text-ink-muted transition-colors duration-150 hover:bg-panel-muted hover:text-ink sm:inline-flex"
        onClick={openDialog}
        type="button"
      >
        <Icon className="size-4" name="search" />
        Search tools
        <kbd className="ml-1 hidden rounded border border-line bg-canvas px-1.5 py-0.5 font-sans text-[10px] text-ink-subtle xl:inline-flex">
          Ctrl K
        </kbd>
      </button>
      <button
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label="Search tools"
        className="inline-flex size-11 items-center justify-center rounded-lg text-ink-muted transition-colors duration-150 hover:bg-panel-muted hover:text-ink sm:hidden"
        onClick={openDialog}
        type="button"
      >
        <Icon className="size-[18px]" name="search" />
      </button>

      {isOpen ? (
        <Suspense
          fallback={
            <div
              aria-live="polite"
              className="fixed inset-0 z-[80] grid place-items-center bg-black/45 p-4 backdrop-blur-sm"
              role="status"
            >
              <span className="rounded-card border border-line bg-panel px-5 py-4 text-sm font-medium text-ink">
                Loading search…
              </span>
            </div>
          }
        >
          <SearchDialogPanel
            categories={categories}
            onClose={closeDialog}
            tools={tools}
          />
        </Suspense>
      ) : null}
    </>
  );
}
