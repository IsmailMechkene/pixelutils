import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
        404 · Not found
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-ink">
        This page isn’t part of the toolbox.
      </h1>
      <p className="mt-4 max-w-xl text-base leading-7 text-ink-muted">
        The address may be incorrect, or the tool may not be published yet.
      </p>
      <Link
        className="mt-8 inline-flex min-h-11 items-center justify-center rounded-[10px] bg-accent px-5 text-sm font-semibold text-accent-ink hover:bg-accent-hover"
        href="/"
      >
        Return home
      </Link>
    </div>
  );
}
