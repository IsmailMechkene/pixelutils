import Link from "next/link";

import { Icon } from "@/components/ui/icon";
import type { GuideDefinition } from "@/lib/guides/types";

interface RelatedGuidesProps {
  guides: readonly GuideDefinition[];
}

export function RelatedGuides({ guides }: RelatedGuidesProps) {
  if (guides.length === 0) return null;

  return (
    <section aria-labelledby="related-guides-title">
      <h2 className="content-title" id="related-guides-title">
        Related guides
      </h2>
      <p className="mt-2 text-sm leading-6 text-ink-muted">
        Read the decisions, limitations, and workflow behind this tool.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {guides.map((guide) => (
          <article
            className="group rounded-card border border-line bg-panel p-4 transition-colors hover:border-accent hover:bg-panel-muted"
            key={guide.slug}
          >
            <p className="mono-label text-accent">{guide.category}</p>
            <h3 className="mt-3 text-base font-semibold leading-6 text-ink">
              <Link
                className="outline-offset-4 hover:text-accent"
                href={`/guides/${guide.slug}`}
              >
                {guide.title}
              </Link>
            </h3>
            <p className="mt-2 text-sm leading-6 text-ink-muted">{guide.summary}</p>
            <Link
              className="mt-4 inline-flex min-h-10 items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-accent hover:text-accent-hover"
              href={`/guides/${guide.slug}`}
            >
              Read guide
              <Icon className="size-4" name="arrow-right" />
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
