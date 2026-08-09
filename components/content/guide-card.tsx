import Link from "next/link";

import { Icon } from "@/components/ui/icon";
import type { GuideDefinition } from "@/lib/guides/types";

interface GuideCardProps {
  guide: GuideDefinition;
}

export function GuideCard({ guide }: GuideCardProps) {
  return (
    <article className="group rounded-card border border-line bg-panel p-5 transition-colors hover:border-accent hover:bg-panel-muted sm:p-6">
      <p className="mono-label text-accent">{guide.category}</p>
      <h2 className="mt-4 text-xl font-semibold leading-7 tracking-tight text-ink">
        <Link className="outline-offset-4 hover:text-accent" href={`/guides/${guide.slug}`}>
          {guide.title}
        </Link>
      </h2>
      <p className="mt-3 text-sm leading-6 text-ink-muted">{guide.summary}</p>
      <div className="mt-6 flex items-center justify-between gap-4 border-t border-line pt-4">
        <span className="font-mono text-xs text-ink-subtle">{guide.readingTime}</span>
        <Link
          className="inline-flex min-h-10 items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-accent hover:text-accent-hover"
          href={`/guides/${guide.slug}`}
        >
          Read guide
          <Icon className="size-4" name="arrow-right" />
        </Link>
      </div>
    </article>
  );
}
