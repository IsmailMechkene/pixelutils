"use client";

import { lazy, Suspense, useEffect, useRef, useState } from "react";

import { Icon } from "@/components/ui/icon";

import { SearchDialogSkeleton } from "./search-dialog-skeleton";

const SearchDialogPanel = lazy(() => import("./search-dialog-panel"));

export function SearchDialog() {
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
        <kbd className="ml-1 hidden rounded-small border border-line bg-canvas px-1.5 py-0.5 font-sans text-xs text-ink-subtle xl:inline-flex">
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
        <Icon className="size-4" name="search" />
      </button>

      {isOpen ? (
        <Suspense fallback={<SearchDialogSkeleton />}>
          <SearchDialogPanel onClose={closeDialog} />
        </Suspense>
      ) : null}
    </>
  );
}
