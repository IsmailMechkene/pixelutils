"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Icon } from "@/components/ui/icon";

const links = [
  { href: "/#find-a-tool", label: "Find a tool" },
  { href: "/#categories", label: "Categories" },
  { href: "/about", label: "About" },
  { href: "/privacy", label: "Privacy" },
];

export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <div className="relative md:hidden">
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
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="absolute right-0 top-13 z-50 w-64 rounded-card border border-line bg-panel p-2 shadow-[0_20px_55px_rgba(0,0,0,0.14)]"
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
        </nav>
      ) : null}
    </div>
  );
}
