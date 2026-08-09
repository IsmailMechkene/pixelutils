import Link from "next/link";

import { SearchDialog } from "@/components/catalog/search-dialog";
import { publishedCategories } from "@/lib/catalog/registry";

import { Logo } from "./logo";
import { MobileNavigation } from "./mobile-navigation";
import { ThemeToggle } from "./theme-toggle";

const links = [
  { href: "/#find-a-tool", label: "Tools" },
  { href: "/#categories", label: "Categories" },
  { href: "/about", label: "About" },
];

export function Header() {
  const categoryItems = publishedCategories.map(({ name, slug }) => ({
    name,
    slug,
  }));

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:px-8">
        <Logo />
        <nav aria-label="Primary navigation" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  className={`inline-flex min-h-10 items-center border-b-2 px-0 font-mono text-xs font-medium uppercase tracking-wider transition-colors duration-150 hover:text-ink ${link.label === "Tools" ? "border-accent text-accent" : "border-transparent text-ink-muted"}`}
                  href={link.href}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center justify-self-end gap-1">
          <SearchDialog />
          <ThemeToggle />
          <MobileNavigation categories={categoryItems} />
        </div>
      </div>
    </header>
  );
}
