"use client";

import { useState } from "react";

import { ActionButton } from "@/components/tool-shell/action-button";
import { ClearButton, CopyButton, ErrorMessage, SampleButton, TextOutputPanel, ToolActions } from "@/components/tool-shell";
import { recordToolHistory } from "@/lib/storage/tool-activity";

import { calculateAge } from "./logic";

function localToday() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function AgeCalculatorWorkspace({ slug }: { slug: string }) {
  const [birthDate, setBirthDate] = useState("");
  const [asOfDate, setAsOfDate] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  function calculate() {
    const result = calculateAge(birthDate, asOfDate);
    if (!result.ok) { setOutput(""); setError(result.error); return; }
    setOutput(`${result.years} years, ${result.months} months, ${result.days} days\nTotal days: ${result.totalDays.toLocaleString("en-US")}`);
    setError(""); recordToolHistory(slug, "processed", { sensitive: false });
  }
  function clear() { setBirthDate(""); setAsOfDate(""); setOutput(""); setError(""); recordToolHistory(slug, "cleared", { sensitive: false }); }
  const controlClass = "mt-2 min-h-11 w-full rounded-[10px] border border-line-strong bg-canvas px-3 text-ink outline-none focus:border-accent";
  return <form onSubmit={(event) => { event.preventDefault(); calculate(); }}>
    <div className="grid gap-5 sm:grid-cols-2"><label className="text-sm font-semibold text-ink">Birth date<input className={controlClass} onChange={(event) => { setBirthDate(event.target.value); setError(""); }} type="date" value={birthDate} /></label><label className="text-sm font-semibold text-ink">Age on date<input className={controlClass} onChange={(event) => { setAsOfDate(event.target.value); setError(""); }} type="date" value={asOfDate} /></label></div>
    <p className="mt-2 text-xs leading-5 text-ink-subtle">Dates are treated as calendar dates, not times, so time zones and daylight-saving changes cannot shift the result. February 29 birthdays use February 28 in non-leap years.</p>
    {error ? <div className="mt-3"><ErrorMessage message={error} /></div> : null}
    <div className="mt-5"><ToolActions><ActionButton icon="calculator" tone="primary" type="submit">Calculate age</ActionButton><ActionButton icon="clock" onClick={() => { setAsOfDate(localToday()); setOutput(""); }} type="button">Use today</ActionButton><SampleButton onSample={() => { setBirthDate("2000-02-29"); setAsOfDate("2025-02-28"); setOutput(""); setError(""); recordToolHistory(slug, "sampled", { sensitive: false }); }} /><ClearButton disabled={!birthDate && !asOfDate && !output} onClear={clear} /></ToolActions></div>
    <div className="mt-6"><TextOutputPanel id="age-output" label="Calculated age" description="Completed calendar years, months, and days." value={output} actions={<CopyButton value={output} onCopied={() => recordToolHistory(slug, "copied", { sensitive: false })} />} /></div>
  </form>;
}
