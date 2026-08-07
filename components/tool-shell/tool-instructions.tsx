interface ToolInstructionsProps {
  steps: readonly string[];
  toolName: string;
}

export function ToolInstructions({ steps, toolName }: ToolInstructionsProps) {
  if (steps.length === 0) return null;

  return (
    <section aria-labelledby="tool-instructions-title">
      <h2
        className="text-2xl font-semibold tracking-[-0.03em] text-ink"
        id="tool-instructions-title"
      >
        How to use {toolName}
      </h2>
      <ol className="mt-5 grid gap-3">
        {steps.map((step, index) => (
          <li className="flex gap-4 text-sm leading-6 text-ink-muted" key={step}>
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-accent-soft text-xs font-bold text-accent">
              {index + 1}
            </span>
            <span className="pt-0.5">{step}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
