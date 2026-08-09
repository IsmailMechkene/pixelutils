import Link from "next/link";

export function Logo() {
  return (
    <Link
      className="group inline-flex min-h-10 items-center gap-3 rounded-control font-semibold tracking-tight text-ink"
      href="/"
      aria-label="PixelUtils home"
    >
      <span className="grid size-9 grid-cols-3 grid-rows-3 place-items-center border border-line bg-panel p-1 text-accent">
        <span className="col-span-2 row-span-2 size-full bg-current" />
        <span className="col-start-3 row-start-1 size-full bg-current opacity-35" />
        <span className="col-start-3 row-start-3 size-full bg-current" />
      </span>
      <span className="font-display text-xl font-bold tracking-tighter">PixelUtils</span>
    </Link>
  );
}
