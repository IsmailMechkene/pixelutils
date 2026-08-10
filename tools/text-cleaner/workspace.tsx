"use client";
import { useState } from "react";
import { TextTransformWorkspace } from "@/components/tool-shell";
import { cleanText } from "./logic";
export default function Workspace({ slug }: { slug: string }) {
  const [trimLines, setTrimLines] = useState(true); const [collapseSpaces, setCollapseSpaces] = useState(true); const [removeEmptyLines, setRemoveEmptyLines] = useState(false);
  const check = "size-4 rounded border-line-strong accent-[var(--accent)]";
  return <><fieldset className="mb-5"><legend className="text-sm font-semibold text-ink">Cleanup options</legend><div className="mt-2 flex flex-wrap gap-x-5 gap-y-2">{[[trimLines,setTrimLines,"Trim each line"],[collapseSpaces,setCollapseSpaces,"Collapse spaces and tabs"],[removeEmptyLines,setRemoveEmptyLines,"Remove empty lines"]].map(([value, setValue, label]) => <label className="flex min-h-11 items-center gap-2 text-sm" key={label as string}><input checked={value as boolean} className={check} onChange={(event) => (setValue as (next: boolean) => void)(event.target.checked)} type="checkbox" />{label as string}</label>)}</div></fieldset><TextTransformWorkspace slug={slug} actionLabel="Clean text" sample={"  First   line\n\nSecond\tline  "} filename="cleaned-text.txt" inputLabel="Text to clean" inputDescription="Cleanup runs locally and preserves the order of your lines." outputLabel="Cleaned text" outputDescription="Use the selected options to normalize pasted text." placeholder="Paste text to clean…" transform={(input) => ({ ok: true as const, value: cleanText(input, { trimLines, collapseSpaces, removeEmptyLines }) })} /></>;
}
