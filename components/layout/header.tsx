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
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/85 backdrop-blur-lg">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:px-8">
        <Logo />
        <nav aria-label="Primary navigation" className="hidden lg:block">
          <ul className="flex items-center gap-0.5 rounded-control bg-panel-muted/70 p-0.5">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  className="inline-flex min-h-8 items-center rounded-lg px-3 text-sm font-medium text-ink-muted transition-colors duration-150 hover:bg-panel hover:text-ink"
                  href={link.href}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center justify-self-end rounded-control border border-line bg-panel/80 p-px shadow-sm">
          <SearchDialog />
          <span aria-hidden="true" className="mx-0.5 h-4 w-px bg-line" />
          <ThemeToggle />
          <MobileNavigation categories={categoryItems} />
        </div>
      </div>
    </header>
  );
}
