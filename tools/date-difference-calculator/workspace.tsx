"use client";

import { useState } from "react";

import { ActionButton, ClearButton, CopyButton, ErrorMessage, SampleButton, TextOutputPanel, ToolActions } from "@/components/tool-shell";
import { recordToolHistory } from "@/lib/storage/tool-activity";

import { calculateDateDifference } from "./logic";

export default function Workspace({ slug }: { slug: string }) {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const input = "mt-2 min-h-11 w-full rounded-control border border-line-strong bg-canvas px-3 text-ink outline-none focus:border-accent";
  function run() { const result = calculateDateDifference(start, end); if (!result.ok) { setError(result.error); setOutput(""); return; } setError(""); setOutput(`${result.days.toLocaleString("en-US")} days between the selected dates.`); recordToolHistory(slug, "processed", { sensitive: false }); }
  return <form onSubmit={(event) => { event.preventDefault(); run(); }}>
    <div className="grid gap-5 sm:grid-cols-2">
      <label className="text-sm font-semibold">Start date<input aria-describedby={error ? "date-difference-error" : undefined} aria-invalid={Boolean(error)} className={input} onChange={(event) => { setStart(event.target.value); setError(""); }} type="date" value={start} /></label>
      <label className="text-sm font-semibold">End date<input aria-describedby={error ? "date-difference-error" : undefined} aria-invalid={Boolean(error)} className={input} onChange={(event) => { setEnd(event.target.value); setError(""); }} type="date" value={end} /></label>
    </div>
    {error ? <div className="mt-3"><ErrorMessage id="date-difference-error" message={error} /></div> : null}
    <div className="mt-5 border-t border-line pt-4"><ToolActions><ActionButton icon="calculator" tone="primary" type="submit">Calculate difference</ActionButton><SampleButton onSample={() => { setStart("2024-02-28"); setEnd("2024-03-01"); setOutput(""); setError(""); }} /><ClearButton disabled={!start && !end && !output} onClear={() => { setStart(""); setEnd(""); setOutput(""); setError(""); }} /></ToolActions></div>
    <div className="mt-6"><TextOutputPanel id="date-difference-output" label="Date difference" description="Uses date-only arithmetic; the result excludes the start date." value={output} actions={<CopyButton value={output} />} /></div>
  </form>;
}
