"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";

import { Icon } from "@/components/ui/icon";

const links = [
  { href: "/#find-a-tool", label: "Find a tool" },
  { href: "/#categories", label: "Categories" },
  { href: "/about", label: "About" },
  { href: "/privacy", label: "Privacy" },
];

interface MobileNavigationProps {
  categories: readonly { readonly name: string; readonly slug: string }[];
}

export function MobileNavigation({ categories }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const navigationRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    menuRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };
    const handlePointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !navigationRef.current?.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isOpen]);

  function handleMenuKeyDown(event: ReactKeyboardEvent<HTMLElement>) {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    const items = Array.from(
      menuRef.current?.querySelectorAll<HTMLAnchorElement>("a") ?? [],
    );
    if (items.length === 0) return;
    event.preventDefault();
    const currentIndex = items.indexOf(
      document.activeElement as HTMLAnchorElement,
    );
    const nextIndex =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? items.length - 1
          : event.key === "ArrowDown"
            ? (currentIndex + 1 + items.length) % items.length
            : (currentIndex - 1 + items.length) % items.length;
    items[nextIndex]?.focus();
  }

  return (
    <div className="relative md:hidden" ref={navigationRef}>
      <button
        ref={buttonRef}
        className="inline-flex size-11 items-center justify-center rounded-[10px] border border-line bg-panel text-ink-muted transition-colors duration-150 hover:border-line-strong hover:text-ink"
        type="button"
        aria-controls="mobile-navigation"
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close navigation" : "Open navigation"}
        onClick={() => setIsOpen((open) => !open)}
      >
        <Icon className="size-5" name={isOpen ? "close" : "menu"} />
      </button>

      {isOpen ? (
        <nav
          ref={menuRef}
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="absolute right-0 top-13 z-50 w-72 rounded-card border border-line bg-panel p-2 shadow-[0_20px_55px_rgba(0,0,0,0.14)]"
          onKeyDown={handleMenuKeyDown}
        >
          {links.map((link) => (
            <Link
              className="flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-ink-muted hover:bg-panel-muted hover:text-ink"
              href={link.href}
              key={link.href}
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="my-2 border-t border-line" />
          <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
            Browse categories
          </p>
          {categories.slice(0, 4).map((category) => (
            <Link
              className="flex min-h-11 items-center justify-between rounded-lg px-3 text-sm font-medium text-ink-muted hover:bg-panel-muted hover:text-ink"
              href={`/categories/${category.slug}`}
              key={category.slug}
              onClick={() => setIsOpen(false)}
            >
              {category.name}
              <Icon className="size-4 text-ink-subtle" name="arrow" />
            </Link>
          ))}
        </nav>
      ) : null}
    </div>
  );
}
