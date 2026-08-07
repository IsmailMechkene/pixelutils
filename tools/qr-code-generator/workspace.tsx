"use client";

/* eslint-disable @next/next/no-img-element -- The preview is a generated local data URL, not a network image. */

import { useState } from "react";

import { ActionButton } from "@/components/tool-shell/action-button";
import {
  ClearButton,
  CopyButton,
  DownloadButton,
  SampleButton,
  TextInputPanel,
  ToolActions,
} from "@/components/tool-shell";
import { CustomColorInput } from "@/components/ui/custom-color-input";
import { CustomSelect } from "@/components/ui/custom-select";
import { recordToolHistory } from "@/lib/storage/tool-activity";

import { validateQrOptions, type QrErrorLevel } from "./logic";

const errorLevelOptions = [
  { value: "L", label: "Low" },
  { value: "M", label: "Medium" },
  { value: "Q", label: "Quartile" },
  { value: "H", label: "High" },
] as const;

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
    setError("");
    setImageUrl("");
    setImageBlob(undefined);
    try {
      const options = validateQrOptions({
        text,
        size,
        margin,
        errorLevel,
        darkColor,
        lightColor,
      });
      const { default: QRCode } = await import("qrcode");
      const url = await QRCode.toDataURL(options.text, {
        width: options.size,
        margin: options.margin,
        errorCorrectionLevel: options.errorLevel,
        color: { dark: options.darkColor, light: options.lightColor },
      });
      setImageUrl(url);
      setImageBlob(dataUrlToBlob(url));
      setError("");
      recordToolHistory(slug, "processed", { sensitive: false });
    } catch (caught) {
      setImageUrl("");
      setImageBlob(undefined);
      setError(caught instanceof Error ? caught.message : String(caught));
    } finally {
      setLoading(false);
    }
  }

  const controlClass =
    "min-h-11 w-full rounded-[10px] border border-line-strong bg-canvas px-3 text-sm text-ink outline-none focus:border-accent";
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void generate();
      }}
    >
      <TextInputPanel
        id="qr-content"
        label="QR code content"
        description="Text is encoded locally and is never sent to a QR service."
        disabled={loading}
        error={error}
        monospace={false}
        onChange={(value) => {
          setText(value);
          setError("");
        }}
        placeholder="https://example.com"
        rows={5}
        value={text}
      />
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <label className="text-sm font-semibold text-ink">
          Size (px)
          <input
            className={`mt-2 ${controlClass}`}
            disabled={loading}
            max={1024}
            min={128}
            onChange={(event) => setSize(event.target.valueAsNumber)}
            type="number"
            value={Number.isNaN(size) ? "" : size}
          />
        </label>
        <label className="text-sm font-semibold text-ink">
          Margin
          <input
            className={`mt-2 ${controlClass}`}
            disabled={loading}
            max={10}
            min={0}
            onChange={(event) => setMargin(event.target.valueAsNumber)}
            type="number"
            value={Number.isNaN(margin) ? "" : margin}
          />
        </label>
        <CustomSelect
          disabled={loading}
          id="qr-error-level"
          label="Error correction"
          onChange={setErrorLevel}
          options={errorLevelOptions}
          value={errorLevel}
        />
        <CustomColorInput
          disabled={loading}
          id="qr-foreground"
          label="Foreground"
          onChange={setDarkColor}
          value={darkColor}
        />
        <CustomColorInput
          disabled={loading}
          id="qr-background"
          label="Background"
          onChange={setLightColor}
          value={lightColor}
        />
      </div>
      <div className="mt-5 border-t border-line pt-4">
        <ToolActions>
          <ActionButton
            disabled={loading}
            icon="sparkles"
            tone="primary"
            type="submit"
          >
            {loading ? "Generating…" : "Generate QR code"}
          </ActionButton>
          <SampleButton
            disabled={loading}
            onSample={() => {
              setText("https://example.com/tools");
              setImageUrl("");
              setImageBlob(undefined);
              recordToolHistory(slug, "sampled", { sensitive: false });
            }}
          />
          <ClearButton
            disabled={loading || (!text && !imageUrl)}
            onClear={() => {
              setText("");
              setImageUrl("");
              setImageBlob(undefined);
              setError("");
              recordToolHistory(slug, "cleared", { sensitive: false });
            }}
          />
        </ToolActions>
      </div>
      <section aria-labelledby="qr-preview-label" className="mt-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3
              className="text-sm font-semibold text-ink"
              id="qr-preview-label"
            >
              QR code preview
            </h3>
            <p
              className="mt-1 text-xs text-ink-subtle"
              id="qr-preview-description"
            >
              Scan and verify the result before sharing it.
            </p>
          </div>
          <ToolActions label="QR output actions">
            <CopyButton label="Copy content" value={imageUrl ? text : ""} />
            <DownloadButton
              data={imageBlob ?? ""}
              filename="qr-code.png"
              mimeType="image/png"
              onDownloaded={() =>
                recordToolHistory(slug, "downloaded", { sensitive: false })
              }
            />
          </ToolActions>
        </div>
        <div
          aria-describedby="qr-preview-description"
          aria-labelledby="qr-preview-label"
          className="mt-3 flex min-h-72 items-center justify-center overflow-auto rounded-card border border-line-strong bg-canvas p-5"
          role="region"
        >
          {imageUrl ? (
            <img
              alt="Generated QR code preview"
              className="max-w-full"
              height={size}
              src={imageUrl}
              width={size}
            />
          ) : (
            <p className="text-sm text-ink-subtle">
              Your QR code will appear here.
            </p>
          )}
        </div>
        <p aria-live="polite" aria-atomic="true" className="sr-only">
          {imageUrl ? "QR code preview generated." : ""}
        </p>
      </section>
    </form>
  );
}
