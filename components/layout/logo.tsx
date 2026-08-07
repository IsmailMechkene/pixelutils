import Link from "next/link";

export function Logo() {
  return (
    <Link
      className="group inline-flex min-h-10 items-center gap-2.5 rounded-lg font-semibold tracking-[-0.025em] text-ink"
      href="/"
      aria-label="PixelUtils home"
    >
      <span className="grid size-8 place-items-center rounded-lg bg-accent text-sm font-bold text-accent-ink">
        P
      </span>
      <span className="text-base">PixelUtils</span>
    </Link>
  );
}
