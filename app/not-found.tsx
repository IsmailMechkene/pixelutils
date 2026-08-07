import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The requested PixelUtils page could not be found.",
  alternates: null,
  openGraph: null,
  twitter: null,
};

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
      <p className="page-eyebrow">404 · Not found</p>
      <h1 className="page-title">This page isn’t part of the toolbox.</h1>
      <p className="mt-4 max-w-xl text-base leading-7 text-ink-muted">
        The address may be incorrect, or the tool may not be published yet.
      </p>
      <Link
        className="mt-8 inline-flex min-h-11 items-center justify-center rounded-control bg-accent px-5 text-sm font-semibold text-accent-ink hover:bg-accent-hover"
        href="/"
      >
        Return home
      </Link>
    </div>
  );
}
