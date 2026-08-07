import Link from "next/link";

export function Logo() {
  return (
    <Link
      className="group inline-flex min-h-11 items-center gap-2.5 rounded-lg font-semibold tracking-[-0.02em] text-ink"
      href="/"
      aria-label="PixelUtils home"
    >
      <span className="grid size-8 place-items-center rounded-[10px] bg-accent text-sm font-bold text-accent-ink shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--accent)_70%,white)]">
        P
      </span>
      <span className="text-[17px]">PixelUtils</span>
    </Link>
  );
}
