"use client";

import { useEffect, useRef, useState } from "react";

import { ActionButton } from "./action-button";

interface CopyButtonProps {
  value: string;
  disabled?: boolean;
  label?: string;
  onCopied?: () => void;
  onError?: (message: string) => void;
}

export function CopyButton({
  value,
  disabled = false,
  label = "Copy",
  onCopied,
  onError,
}: CopyButtonProps) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    [],
  );

  async function copyValue() {
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard access is not available in this browser.");
      }
      await navigator.clipboard.writeText(value);
      setState("copied");
      onCopied?.();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setState("idle"), 1800);
    } catch (error) {
      setState("failed");
      onError?.(
        error instanceof Error
          ? error.message
          : "The value could not be copied.",
      );
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setState("idle"), 2200);
    }
  }

  return (
    <ActionButton
      disabled={disabled || !value}
      icon={
        state === "copied" ? "check" : state === "failed" ? "close" : "copy"
      }
      onClick={copyValue}
      tone="quiet"
      aria-live="polite"
    >
      {state === "copied"
        ? "Copied"
        : state === "failed"
          ? "Copy failed"
          : label}
    </ActionButton>
  );
}
