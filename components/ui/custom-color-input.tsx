"use client";

import { useEffect, useRef, useState } from "react";

import {
  hexToHsl,
  hslToHex,
  normalizeHexColorInput,
  type HslColor,
} from "@/lib/ui/color-input";

interface CustomColorInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

const colorPresets = [
  "#111111",
  "#FFFFFF",
  "#EF4444",
  "#F97316",
  "#EAB308",
  "#22C55E",
  "#06B6D4",
  "#3B82F6",
  "#6366F1",
  "#8B5CF6",
  "#EC4899",
  "#64748B",
] as const;

export function CustomColorInput({
  id,
  label,
  value,
  onChange,
  disabled = false,
  className = "",
}: CustomColorInputProps) {
  const [draft, setDraft] = useState<string>();
  const [invalid, setInvalid] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const firstPresetRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const labelId = `${id}-label`;
  const errorId = `${id}-error`;
  const popoverId = `${id}-popover`;
  const displayedValue = draft ?? value.toUpperCase();
  const hsl = hexToHsl(value);

  useEffect(() => {
    if (!isOpen) return;
    firstPresetRef.current?.focus();

    function handlePointerDown(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !containerRef.current?.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setIsOpen(false);
      window.setTimeout(() => triggerRef.current?.focus(), 0);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function commit(input: string) {
    const normalized = normalizeHexColorInput(input);
    if (!normalized) return false;
    onChange(normalized);
    setInvalid(false);
    return true;
  }

  function updateHsl(channel: keyof HslColor, nextValue: number) {
    onChange(hslToHex({ ...hsl, [channel]: nextValue }));
    setDraft(undefined);
    setInvalid(false);
  }

  return (
    <div
      aria-labelledby={labelId}
      className={`relative ${className}`}
      ref={containerRef}
      role="group"
    >
      <span className="block text-sm font-semibold text-ink" id={labelId}>
        {label}
      </span>
      <div
        className={`mt-2 flex min-h-11 items-stretch overflow-hidden rounded-[10px] border bg-canvas transition-[border-color,box-shadow] focus-within:border-accent ${
          invalid ? "border-danger-line" : "border-line-strong"
        } ${disabled ? "opacity-55" : ""}`}
      >
        <button
          ref={triggerRef}
          aria-controls={popoverId}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          aria-label={`Choose ${label.toLowerCase()} color`}
          className="grid min-w-11 place-items-center border-r border-line bg-panel-muted transition-colors hover:bg-accent-soft disabled:cursor-not-allowed"
          disabled={disabled}
          onClick={() => setIsOpen((open) => !open)}
          type="button"
        >
          <span
            aria-hidden="true"
            className="size-6 rounded-md border border-black/15 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.2)] dark:border-white/20"
            style={{ backgroundColor: value }}
          />
        </button>
        <input
          aria-describedby={invalid ? errorId : undefined}
          aria-invalid={invalid}
          aria-label={`${label} HEX value`}
          autoCapitalize="characters"
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent px-3 font-mono text-sm font-medium tracking-wide text-ink outline-none disabled:cursor-not-allowed"
          disabled={disabled}
          maxLength={7}
          onBlur={() => {
            if (!commit(displayedValue)) {
              setInvalid(true);
              return;
            }
            setDraft(undefined);
          }}
          onChange={(event) => {
            const nextDraft = event.target.value;
            setDraft(nextDraft);
            setInvalid(false);
            commit(nextDraft);
          }}
          onFocus={() => setDraft(value.toUpperCase())}
          spellCheck={false}
          value={displayedValue}
        />
      </div>

      {isOpen ? (
        <div
          aria-label={`Choose ${label.toLowerCase()} color`}
          className="search-results-scrollbar absolute right-0 top-[calc(100%+8px)] z-[80] max-h-[min(24rem,calc(100vh-2rem))] w-[min(18rem,calc(100vw-2rem))] overflow-y-auto rounded-card border border-line bg-panel p-3.5 shadow-[0_20px_55px_rgba(0,0,0,0.22)] outline-none"
          id={popoverId}
          role="dialog"
        >
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="size-10 shrink-0 rounded-lg border border-black/15 dark:border-white/20"
              style={{ backgroundColor: value }}
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-ink">{label} color</p>
              <p className="mt-0.5 font-mono text-xs text-ink-subtle">
                {value.toUpperCase()}
              </p>
            </div>
          </div>

          <div
            className="mt-4 grid grid-cols-6 gap-2"
            role="group"
            aria-label="Color presets"
          >
            {colorPresets.map((preset, index) => (
              <button
                aria-label={`Set color to ${preset}`}
                aria-pressed={value.toUpperCase() === preset}
                className="grid size-8 place-items-center rounded-lg border border-black/15 transition-transform hover:scale-105 aria-pressed:ring-2 aria-pressed:ring-accent aria-pressed:ring-offset-2 aria-pressed:ring-offset-panel dark:border-white/20"
                key={preset}
                onClick={() => {
                  onChange(preset);
                  setDraft(undefined);
                  setInvalid(false);
                }}
                ref={index === 0 ? firstPresetRef : undefined}
                style={{ backgroundColor: preset }}
                type="button"
              >
                <span className="sr-only">{preset}</span>
              </button>
            ))}
          </div>

          <div className="mt-4 space-y-3">
            <ColorRange
              label="Hue"
              max={359}
              onChange={(nextValue) => updateHsl("hue", nextValue)}
              style="hue"
              suffix="°"
              value={hsl.hue}
            />
            <ColorRange
              background={`linear-gradient(90deg, hsl(${hsl.hue} 0% ${hsl.lightness}%), hsl(${hsl.hue} 100% ${hsl.lightness}%))`}
              label="Saturation"
              max={100}
              onChange={(nextValue) => updateHsl("saturation", nextValue)}
              style="saturation"
              suffix="%"
              value={hsl.saturation}
            />
            <ColorRange
              background={`linear-gradient(90deg, #050505, hsl(${hsl.hue} ${hsl.saturation}% 50%), #ffffff)`}
              label="Lightness"
              max={100}
              onChange={(nextValue) => updateHsl("lightness", nextValue)}
              style="lightness"
              suffix="%"
              value={hsl.lightness}
            />
          </div>

          <button
            className="mt-4 min-h-11 w-full rounded-[10px] bg-panel-muted px-3 text-sm font-semibold text-ink transition-colors hover:bg-accent-soft"
            onClick={() => {
              setIsOpen(false);
              window.setTimeout(() => triggerRef.current?.focus(), 0);
            }}
            type="button"
          >
            Done
          </button>
        </div>
      ) : null}

      {invalid ? (
        <p className="mt-1.5 text-xs text-danger" id={errorId} role="alert">
          Enter a 3- or 6-digit HEX color.
        </p>
      ) : null}
    </div>
  );
}

interface ColorRangeProps {
  label: string;
  max: number;
  value: number;
  onChange: (value: number) => void;
  style: "hue" | "saturation" | "lightness";
  suffix: string;
  background?: string;
}

function ColorRange({
  label,
  max,
  value,
  onChange,
  style,
  suffix,
  background,
}: ColorRangeProps) {
  return (
    <label className="block">
      <span className="flex items-center justify-between gap-3 text-xs font-medium text-ink-muted">
        <span>{label}</span>
        <span className="tabular-nums">
          {value}
          {suffix}
        </span>
      </span>
      <input
        aria-label={label}
        className={`color-range color-range-${style} mt-1.5 block w-full`}
        max={max}
        min={0}
        onChange={(event) => onChange(event.target.valueAsNumber)}
        style={background ? { background } : undefined}
        type="range"
        value={value}
      />
    </label>
  );
}
