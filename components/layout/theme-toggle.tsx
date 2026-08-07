"use client";

import { useEffect, useState } from "react";

import { Icon } from "@/components/ui/icon";

type ThemePreference = "light" | "dark" | "system";

const themes: readonly ThemePreference[] = ["system", "light", "dark"];

function getStoredTheme(): ThemePreference {
  if (typeof window === "undefined") return "system";
  try {
    const stored = window.localStorage.getItem("pixelutils-theme");
    return themes.includes(stored as ThemePreference)
      ? (stored as ThemePreference)
      : "system";
  } catch {
    return "system";
  }
}

function applyTheme(theme: ThemePreference) {
  const resolved =
    theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme;

  document.documentElement.dataset.theme = resolved;
  document.documentElement.style.colorScheme = resolved;
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemePreference>(getStoredTheme);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const updateSystemTheme = () => {
      if (theme === "system") applyTheme("system");
    };

    applyTheme(theme);
    media.addEventListener("change", updateSystemTheme);
    return () => media.removeEventListener("change", updateSystemTheme);
  }, [theme]);

  function cycleTheme() {
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    try {
      window.localStorage.setItem("pixelutils-theme", nextTheme);
    } catch {
      // Theme selection still works for this page when storage is unavailable.
    }
    setTheme(nextTheme);
  }

  const nextTheme = themes[(themes.indexOf(theme) + 1) % themes.length];
  const label = `Theme: ${theme}. Switch to ${nextTheme}.`;
  const icon = theme === "light" ? "sun" : theme === "dark" ? "moon" : "system";

  return (
    <button
      className="inline-flex size-11 items-center justify-center rounded-[10px] border border-line bg-panel text-ink-muted transition-colors duration-150 hover:border-line-strong hover:text-ink"
      type="button"
      onClick={cycleTheme}
      aria-label={label}
      title={label}
      suppressHydrationWarning
    >
      <Icon className="size-[18px]" name={icon} />
    </button>
  );
}
