import { SearchDialog } from "@/components/catalog/search-dialog";
import { publishedCategories } from "@/lib/catalog/registry";

import { Logo } from "./logo";
import { MobileNavigation } from "./mobile-navigation";
import { PrimaryNavigation } from "./primary-navigation";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  const categoryItems = publishedCategories.map(({ name, slug }) => ({
    name,
    slug,
  }));

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:px-8">
        <Logo />
        <PrimaryNavigation />
        <div className="flex items-center justify-self-end gap-1">
          <SearchDialog />
          <ThemeToggle />
          <MobileNavigation categories={categoryItems} />
        </div>
      </div>
    </header>
  );
}
