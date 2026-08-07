"use client";

/* eslint-disable @next/next/no-img-element -- The preview is a generated local data URL, not a network image. */

import { useState } from "react";

import { ActionButton } from "@/components/tool-shell/action-button";
import { ClearButton, CopyButton, DownloadButton, SampleButton, TextInputPanel, ToolActions } from "@/components/tool-shell";
import { recordToolHistory } from "@/lib/storage/tool-activity";

import { validateQrOptions, type QrErrorLevel } from "./logic";

function dataUrlToBlob(dataUrl: string) {
  const [header = "", encoded = ""] = dataUrl.split(",");
  const mime = header.match(/^data:([^;]+)/)?.[1] ?? "image/png";
  const binary = atob(encoded);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new Blob([bytes], { type: mime });
}

export default function QrCodeGeneratorWorkspace({ slug }: { slug: string }) {
  const [text, setText] = useState("");
  const [size, setSize] = useState(320);
  const [margin, setMargin] = useState(4);
  const [errorLevel, setErrorLevel] = useState<QrErrorLevel>("M");
  const [darkColor, setDarkColor] = useState("#111111");
  const [lightColor, setLightColor] = useState("#ffffff");
  const [imageUrl, setImageUrl] = useState("");
  const [imageBlob, setImageBlob] = useState<Blob>();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    try {
      const options = validateQrOptions({ text, size, margin, errorLevel, darkColor, lightColor });
      const { default: QRCode } = await import("qrcode");
      const url = await QRCode.toDataURL(options.text, { width: options.size, margin: options.margin, errorCorrectionLevel: options.errorLevel, color: { dark: options.darkColor, light: options.lightColor } });
      setImageUrl(url); setImageBlob(dataUrlToBlob(url)); setError("");
      recordToolHistory(slug, "processed", { sensitive: false });
    } catch (caught) { setImageUrl(""); setImageBlob(undefined); setError(caught instanceof Error ? caught.message : String(caught)); }
    finally { setLoading(false); }
  }

  const controlClass = "min-h-11 w-full rounded-[10px] border border-line-strong bg-canvas px-3 text-sm text-ink outline-none focus:border-accent";
  return <form onSubmit={(event) => { event.preventDefault(); void generate(); }}>
    <TextInputPanel id="qr-content" label="QR code content" description="Text is encoded locally and is never sent to a QR service." error={error} monospace={false} onChange={(value) => { setText(value); setError(""); }} placeholder="https://example.com" rows={5} value={text} />
    <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <label className="text-sm font-semibold text-ink">Size (px)<input className={`mt-2 ${controlClass}`} max={1024} min={128} onChange={(event) => setSize(event.target.valueAsNumber)} type="number" value={size} /></label>
      <label className="text-sm font-semibold text-ink">Margin<input className={`mt-2 ${controlClass}`} max={10} min={0} onChange={(event) => setMargin(event.target.valueAsNumber)} type="number" value={margin} /></label>
      <label className="text-sm font-semibold text-ink">Error correction<select className={`mt-2 ${controlClass}`} onChange={(event) => setErrorLevel(event.target.value as QrErrorLevel)} value={errorLevel}><option value="L">Low</option><option value="M">Medium</option><option value="Q">Quartile</option><option value="H">High</option></select></label>
      <label className="text-sm font-semibold text-ink">Foreground<input className="mt-2 block h-11 w-full rounded-[10px] border border-line-strong bg-canvas p-1" onChange={(event) => setDarkColor(event.target.value)} type="color" value={darkColor} /></label>
      <label className="text-sm font-semibold text-ink">Background<input className="mt-2 block h-11 w-full rounded-[10px] border border-line-strong bg-canvas p-1" onChange={(event) => setLightColor(event.target.value)} type="color" value={lightColor} /></label>
    </div>
    <div className="mt-5"><ToolActions><ActionButton disabled={loading} icon="sparkles" tone="primary" type="submit">{loading ? "Generating…" : "Generate QR code"}</ActionButton><SampleButton onSample={() => { setText("https://pixelutils.example/tools"); setImageUrl(""); setImageBlob(undefined); recordToolHistory(slug, "sampled", { sensitive: false }); }} /><ClearButton disabled={!text && !imageUrl} onClear={() => { setText(""); setImageUrl(""); setImageBlob(undefined); setError(""); recordToolHistory(slug, "cleared", { sensitive: false }); }} /></ToolActions></div>
    <section aria-labelledby="qr-preview-label" className="mt-6"><div className="flex flex-wrap items-end justify-between gap-3"><div><h3 className="text-sm font-semibold text-ink" id="qr-preview-label">QR code preview</h3><p className="mt-1 text-xs text-ink-subtle">Scan and verify the result before sharing it.</p></div><ToolActions label="QR output actions"><CopyButton label="Copy content" value={imageUrl ? text : ""} /><DownloadButton data={imageBlob ?? ""} filename="qr-code.png" mimeType="image/png" onDownloaded={() => recordToolHistory(slug, "downloaded", { sensitive: false })} /></ToolActions></div><div aria-live="polite" className="mt-3 flex min-h-72 items-center justify-center overflow-auto rounded-card border border-line-strong bg-canvas p-5" role="status">{imageUrl ? <img alt={`QR code encoding: ${text}`} className="max-w-full" height={size} src={imageUrl} width={size} /> : <p className="text-sm text-ink-subtle">Your QR code will appear here.</p>}</div></section>
  </form>;
}
