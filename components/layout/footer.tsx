import Link from "next/link";

import { publishedCategories } from "@/lib/catalog/registry";

import { Logo } from "./logo";

const productLinks = [
  { href: "/#find-a-tool", label: "Find a tool" },
  { href: "/#categories", label: "Browse categories" },
  { href: "/about", label: "About PixelUtils" },
] as const;

const trustLinks = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/contact", label: "Contact" },
] as const;

const footerLinkClass =
  "inline-flex min-h-11 items-center rounded-lg text-sm text-ink-muted transition-colors duration-150 hover:text-ink";

export function Footer() {
  return (
    <footer className="border-t border-line bg-panel">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 sm:py-12 md:grid-cols-[1.35fr_1fr_1fr] lg:gap-16 lg:px-8">
        <div className="max-w-md">
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-6 text-ink-muted">
            Thoughtful browser tools that put speed, clarity, and privacy first.
          </p>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-accent">
            Fast / Private / No account
          </p>
        </div>

        <nav aria-labelledby="footer-product-title">
          <h2
            className="text-sm font-semibold text-ink"
            id="footer-product-title"
          >
            Explore
          </h2>
          <ul className="mt-2 grid gap-0.5">
            {productLinks.map((link) => (
              <li key={link.href}>
                <Link className={footerLinkClass} href={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
            {publishedCategories.slice(0, 3).map((category) => (
              <li key={category.slug}>
                <Link
                  className={footerLinkClass}
                  href={`/categories/${category.slug}`}
                >
                  {category.name} tools
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-trust-title">
          <h2
            className="text-sm font-semibold text-ink"
            id="footer-trust-title"
          >
            Trust &amp; legal
          </h2>
          <ul className="mt-2 grid gap-0.5">
            {trustLinks.map((link) => (
              <li key={link.href}>
                <Link className={footerLinkClass} href={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs leading-5 text-ink-subtle sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            {"\u00a9"} {new Date().getFullYear()} PixelUtils.
          </p>
          <p>Each tool states clearly where processing happens.</p>
        </div>
      </div>
    </footer>
  );
}
