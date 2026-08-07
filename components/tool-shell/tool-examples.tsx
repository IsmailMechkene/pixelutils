import type { ToolExample } from "@/lib/catalog/types";

interface ToolExamplesProps {
  examples: readonly ToolExample[];
}

export function ToolExamples({ examples }: ToolExamplesProps) {
  if (examples.length === 0) return null;

  return (
    <section aria-labelledby="tool-examples-title">
      <h2 className="content-title" id="tool-examples-title">
        Examples
      </h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {examples.map((example) => (
          <article
            className="rounded-card border border-line bg-panel p-5"
            key={example.name}
          >
            <h3 className="text-base font-semibold text-ink">{example.name}</h3>
            <dl className="mt-4 grid gap-4 text-sm">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">
                  Input
                </dt>
                <dd className="mt-2 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-canvas p-3 font-mono leading-6 text-ink-muted">
                  {example.input}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">
                  Output
                </dt>
                <dd className="mt-2 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-canvas p-3 font-mono leading-6 text-ink-muted">
                  {example.output}
                </dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}
