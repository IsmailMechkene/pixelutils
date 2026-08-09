"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/#find-a-tool", label: "Tools", pathPrefix: "/tools" },
  { href: "/#categories", label: "Categories", pathPrefix: "/categories" },
  { href: "/guides", label: "Guides", pathPrefix: "/guides" },
  { href: "/about", label: "About", pathPrefix: "/about" },
] as const;

export function PrimaryNavigation() {
  const pathname = usePathname() ?? "";

  return (
    <nav aria-label="Primary navigation" className="hidden lg:block">
      <ul className="flex items-center gap-8">
        {links.map((link) => {
          const isActive =
            pathname === link.pathPrefix ||
            pathname.startsWith(`${link.pathPrefix}/`);

          return (
            <li key={link.href}>
              <Link
                aria-current={isActive ? "page" : undefined}
                className="inline-flex min-h-10 items-center border-b-2 px-0 font-mono text-xs font-medium uppercase tracking-wider text-ink-muted transition-colors duration-150 hover:text-ink aria-[current=page]:border-accent aria-[current=page]:text-accent"
                href={link.href}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
