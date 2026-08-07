"use client";

import { useState } from "react";

import { ActionButton } from "@/components/tool-shell/action-button";
import { ClearButton, CopyButton, DownloadButton, SampleButton, TextInputPanel, TextOutputPanel, ToolActions } from "@/components/tool-shell";
import { recordToolHistory } from "@/lib/storage/tool-activity";

import { removeDuplicateLines } from "./logic";

const sample = "Orchid\nFern\norchid\nMoss\nFern\n  Moss";

export default function DuplicateLineRemoverWorkspace({ slug }: { slug: string }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [removed, setRemoved] = useState(0);
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [trimForComparison, setTrimForComparison] = useState(false);
  const [removeEmptyLines, setRemoveEmptyLines] = useState(false);

  function process() {
    const result = removeDuplicateLines(input, { caseSensitive, trimForComparison, removeEmptyLines });
    setOutput(result.value); setRemoved(result.removed);
    recordToolHistory(slug, "processed", { sensitive: false });
  }

  const checkboxClass = "size-4 rounded border-line-strong accent-[var(--accent)]";
  return (
    <form onSubmit={(event) => { event.preventDefault(); process(); }}>
      <fieldset>
        <legend className="text-sm font-semibold text-ink">Comparison options</legend>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-5">
          <label className="flex min-h-11 cursor-pointer items-center gap-2 text-sm text-ink"><input checked={caseSensitive} className={checkboxClass} onChange={(event) => setCaseSensitive(event.target.checked)} type="checkbox" />Case-sensitive</label>
          <label className="flex min-h-11 cursor-pointer items-center gap-2 text-sm text-ink"><input checked={trimForComparison} className={checkboxClass} onChange={(event) => setTrimForComparison(event.target.checked)} type="checkbox" />Ignore surrounding spaces</label>
          <label className="flex min-h-11 cursor-pointer items-center gap-2 text-sm text-ink"><input checked={removeEmptyLines} className={checkboxClass} onChange={(event) => setRemoveEmptyLines(event.target.checked)} type="checkbox" />Remove empty lines</label>
        </div>
      </fieldset>
      <div className="mt-4"><ToolActions label="Cleanup actions">
        <ActionButton disabled={!input} icon="refresh" tone="primary" type="submit">Remove duplicates</ActionButton>
        <SampleButton onSample={() => { setInput(sample); setOutput(""); setRemoved(0); recordToolHistory(slug, "sampled", { sensitive: false }); }} /><ClearButton disabled={!input && !output} onClear={() => { setInput(""); setOutput(""); setRemoved(0); recordToolHistory(slug, "cleared", { sensitive: false }); }} />
      </ToolActions></div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <TextInputPanel description="The first occurrence stays in its original position." id="duplicate-lines-input" label="Lines to clean" onChange={setInput} placeholder={'alpha\nbeta\nalpha'} value={input} />
        <TextOutputPanel actions={<ToolActions label="Output actions"><CopyButton value={output} onCopied={() => recordToolHistory(slug, "copied", { sensitive: false })} /><DownloadButton data={output} filename="unique-lines.txt" onDownloaded={() => recordToolHistory(slug, "downloaded", { sensitive: false })} /></ToolActions>} description={output ? `${removed} ${removed === 1 ? "line" : "lines"} removed.` : "Unique lines will appear here."} id="duplicate-lines-output" label="Unique lines" value={output} />
      </div>
    </form>
  );
}
