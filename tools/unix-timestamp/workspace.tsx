"use client";

import { useState } from "react";

import { ActionButton } from "@/components/tool-shell/action-button";
import {
  ClearButton,
  CopyButton,
  DownloadButton,
  ErrorMessage,
  SampleButton,
  TextOutputPanel,
  ToolActions,
} from "@/components/tool-shell";
import { recordToolHistory } from "@/lib/storage/tool-activity";

import { dateToTimestamp, timestampToDate, type TimestampUnit } from "./logic";

type Direction = "timestamp-to-date" | "date-to-timestamp";

export default function UnixTimestampWorkspace({ slug }: { slug: string }) {
  const [direction, setDirection] = useState<Direction>("timestamp-to-date");
  const [unit, setUnit] = useState<TimestampUnit>("seconds");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  function convert() {
    if (direction === "timestamp-to-date") {
      const result = timestampToDate(input, unit);
      if (!result.ok) { setError(result.error); setOutput(""); return; }
      const local = new Date(result.milliseconds).toLocaleString(undefined, {
        dateStyle: "full",
        timeStyle: "long",
      });
      setOutput(`UTC: ${result.iso}\nLocal: ${local}`);
    } else {
      try {
        if (!input) throw new Error("Enter a date and time.");
        setOutput(String(dateToTimestamp(new Date(input), unit)));
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : String(caught));
        setOutput("");
        return;
      }
    }
    setError("");
    recordToolHistory(slug, "processed", { sensitive: false });
  }

  function setConversion(value: Direction) {
    setDirection(value); setInput(""); setOutput(""); setError("");
  }

  return (
    <form onSubmit={(event) => { event.preventDefault(); convert(); }}>
      <fieldset>
        <legend className="text-sm font-semibold text-ink">Conversion direction</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {(["timestamp-to-date", "date-to-timestamp"] as const).map((value) => (
            <label className={`inline-flex min-h-11 cursor-pointer items-center rounded-[10px] border px-4 text-sm font-semibold ${direction === value ? "border-accent bg-accent-soft text-accent-strong" : "border-line bg-panel text-ink-muted"}`} key={value}>
              <input checked={direction === value} className="sr-only" name="timestamp-direction" onChange={() => setConversion(value)} type="radio" />
              {value === "timestamp-to-date" ? "Timestamp to date" : "Date to timestamp"}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <label className="text-sm font-semibold text-ink" htmlFor="timestamp-input">
            {direction === "timestamp-to-date" ? "Unix timestamp" : "Local date and time"}
          </label>
          <input
            aria-describedby={error ? "timestamp-error" : "timestamp-help"}
            aria-invalid={Boolean(error)}
            className="mt-2 min-h-11 w-full rounded-[10px] border border-line-strong bg-canvas px-3 font-mono text-sm text-ink outline-none focus:border-accent"
            id="timestamp-input"
            onChange={(event) => { setInput(event.target.value); setError(""); }}
            placeholder={direction === "timestamp-to-date" ? "1704067200" : undefined}
            type={direction === "timestamp-to-date" ? "text" : "datetime-local"}
            value={input}
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-ink" htmlFor="timestamp-unit">Timestamp unit</label>
          <select className="mt-2 min-h-11 w-full rounded-[10px] border border-line-strong bg-canvas px-3 text-sm text-ink outline-none focus:border-accent" id="timestamp-unit" onChange={(event) => { setUnit(event.target.value as TimestampUnit); setOutput(""); }} value={unit}>
            <option value="seconds">Seconds (10 digits today)</option>
            <option value="milliseconds">Milliseconds (13 digits today)</option>
          </select>
        </div>
      </div>
      <p className="mt-2 text-xs leading-5 text-ink-subtle" id="timestamp-help">
        Units are never guessed. Dates entered here use your browser&apos;s local time zone; UTC is shown explicitly in results.
      </p>
      {error ? <div className="mt-3"><ErrorMessage id="timestamp-error" message={error} /></div> : null}
      <div className="mt-5">
        <ToolActions label="Converter actions">
          <ActionButton icon="refresh" tone="primary" type="submit">Convert</ActionButton>
          <SampleButton onSample={() => { setInput(direction === "timestamp-to-date" ? (unit === "seconds" ? "1704067200" : "1704067200000") : "2024-01-01T12:00"); setOutput(""); setError(""); recordToolHistory(slug, "sampled", { sensitive: false }); }} />
          <ClearButton disabled={!input && !output} onClear={() => { setInput(""); setOutput(""); setError(""); recordToolHistory(slug, "cleared", { sensitive: false }); }} />
        </ToolActions>
      </div>
      <div className="mt-6">
        <TextOutputPanel actions={<ToolActions label="Output actions"><CopyButton value={output} onError={setError} onCopied={() => recordToolHistory(slug, "copied", { sensitive: false })} /><DownloadButton data={output} filename="timestamp-conversion.txt" onDownloaded={() => recordToolHistory(slug, "downloaded", { sensitive: false })} /></ToolActions>} description={direction === "timestamp-to-date" ? "UTC and your browser's local representation." : `Unix ${unit}.`} id="timestamp-output" label="Conversion result" value={output} />
      </div>
    </form>
  );
}
