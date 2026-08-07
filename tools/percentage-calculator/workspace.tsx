"use client";

import { useState } from "react";

import { ActionButton } from "@/components/tool-shell/action-button";
import { ClearButton, CopyButton, ErrorMessage, SampleButton, TextOutputPanel, ToolActions } from "@/components/tool-shell";
import { recordToolHistory } from "@/lib/storage/tool-activity";

import { calculatePercentage, type PercentageMode } from "./logic";

const modeLabels: Record<PercentageMode, [string, string]> = { "percent-of": ["Percentage", "Value"], "what-percent": ["Part", "Total"], change: ["Starting value", "Final value"] };

export default function PercentageCalculatorWorkspace({ slug }: { slug: string }) {
  const [mode, setMode] = useState<PercentageMode>("percent-of");
  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const labels = modeLabels[mode];

  function calculate() {
    const result = calculatePercentage(mode, Number(first), Number(second));
    if (!first || !second) { setOutput(""); setError("Enter both numbers."); return; }
    if (!result.ok) { setOutput(""); setError(result.error); return; }
    setOutput(result.summary); setError(""); recordToolHistory(slug, "processed", { sensitive: false });
  }
  function clear() { setFirst(""); setSecond(""); setOutput(""); setError(""); recordToolHistory(slug, "cleared", { sensitive: false }); }
  const controlClass = "mt-2 min-h-11 w-full rounded-[10px] border border-line-strong bg-canvas px-3 text-ink outline-none focus:border-accent";
  return <form onSubmit={(event) => { event.preventDefault(); calculate(); }}>
    <label className="text-sm font-semibold text-ink">Calculation<select className={controlClass} onChange={(event) => { setMode(event.target.value as PercentageMode); clear(); }} value={mode}><option value="percent-of">What is X% of Y?</option><option value="what-percent">X is what percent of Y?</option><option value="change">Percentage change from X to Y</option></select></label>
    <div className="mt-5 grid gap-5 sm:grid-cols-2"><label className="text-sm font-semibold text-ink">{labels[0]}<input className={controlClass} inputMode="decimal" onChange={(event) => { setFirst(event.target.value); setError(""); }} step="any" type="number" value={first} /></label><label className="text-sm font-semibold text-ink">{labels[1]}<input className={controlClass} inputMode="decimal" onChange={(event) => { setSecond(event.target.value); setError(""); }} step="any" type="number" value={second} /></label></div>
    {error ? <div className="mt-3"><ErrorMessage message={error} /></div> : null}
    <div className="mt-5"><ToolActions><ActionButton icon="calculator" tone="primary" type="submit">Calculate</ActionButton><SampleButton onSample={() => { const sample = mode === "percent-of" ? ["15", "240"] : mode === "what-percent" ? ["30", "120"] : ["80", "100"]; setFirst(sample[0] ?? ""); setSecond(sample[1] ?? ""); setOutput(""); setError(""); recordToolHistory(slug, "sampled", { sensitive: false }); }} /><ClearButton disabled={!first && !second && !output} onClear={clear} /></ToolActions></div>
    <div className="mt-6"><TextOutputPanel id="percentage-output" label="Result" monospace={false} value={output} actions={<CopyButton value={output} onCopied={() => recordToolHistory(slug, "copied", { sensitive: false })} />} /></div>
  </form>;
}
