"use client";

import Link from "next/link";

export default function ErrorPage({ retry }: { retry: () => void }) {
  return (
    <div
      className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6"
      role="alert"
    >
      <p className="page-eyebrow">Unexpected error</p>
      <h1 className="page-title">This page could not be displayed.</h1>
      <p className="mt-4 max-w-xl text-base leading-7 text-ink-muted">
        Your tool input has not been sent anywhere. Try the page again, or
        return home if the problem continues.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          className="inline-flex min-h-11 items-center justify-center rounded-control bg-accent px-5 text-sm font-semibold text-accent-ink hover:bg-accent-hover"
          onClick={retry}
          type="button"
        >
          Try again
        </button>
        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-control border border-line-strong bg-panel px-5 text-sm font-semibold text-ink hover:bg-panel-hover"
          href="/"
        >
          Return home
        </Link>
      </div>
    </div>
  );
}
