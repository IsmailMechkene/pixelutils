import type { FaqEntry } from "@/lib/catalog/types";

interface ToolFaqProps {
  entries: readonly FaqEntry[];
}

export function ToolFAQ({ entries }: ToolFaqProps) {
  if (entries.length === 0) return null;

  return (
    <section aria-labelledby="tool-faq-title">
      <h2
        className="text-2xl font-semibold tracking-[-0.03em] text-ink"
        id="tool-faq-title"
      >
        Frequently asked questions
      </h2>
      <div className="mt-5 divide-y divide-line rounded-card border border-line bg-panel px-5">
        {entries.map((entry) => (
          <details className="group py-4" key={entry.question}>
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-ink marker:content-none">
              {entry.question}
              <span
                aria-hidden="true"
                className="text-xl font-normal text-ink-subtle group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="pb-2 pr-8 text-sm leading-7 text-ink-muted">{entry.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
