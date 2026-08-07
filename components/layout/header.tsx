import Link from "next/link";

import { SearchDialog } from "@/components/catalog/search-dialog";
import { publishedCategories, publishedTools } from "@/lib/catalog/registry";
import { createToolSearchItems } from "@/lib/catalog/search";

import { Logo } from "./logo";
import { MobileNavigation } from "./mobile-navigation";
import { ThemeToggle } from "./theme-toggle";

const links = [
  { href: "/#find-a-tool", label: "Tools" },
  { href: "/#categories", label: "Categories" },
  { href: "/about", label: "About" },
];

export function Header() {
  const searchItems = createToolSearchItems(publishedTools);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />
        <div className="flex items-center gap-2">
          <nav aria-label="Primary navigation" className="mr-2 hidden md:block">
            <ul className="flex items-center gap-1">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-ink-muted transition-colors duration-150 hover:bg-panel-muted hover:text-ink"
                    href={link.href}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <SearchDialog tools={searchItems} />
          <ThemeToggle />
          <MobileNavigation
            categories={publishedCategories.map(({ name, slug }) => ({
              name,
              slug,
            }))}
          />
        </div>
      </div>
    </header>
  );
}
