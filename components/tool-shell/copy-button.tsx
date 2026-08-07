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
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

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
      setCopied(true);
      onCopied?.();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      onError?.(
        error instanceof Error ? error.message : "The value could not be copied.",
      );
    }
  }

  return (
    <ActionButton
      disabled={disabled || !value}
      icon={copied ? "check" : "copy"}
      onClick={copyValue}
      aria-live="polite"
    >
      {copied ? "Copied" : label}
    </ActionButton>
  );
}
