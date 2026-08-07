"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";

import {
  findSelectOptionByPrefix,
  getNextSelectIndex,
  type SelectNavigationKey,
} from "@/lib/ui/select-navigation";

export interface CustomSelectOption<Value extends string> {
  readonly value: Value;
  readonly label: string;
  readonly description?: string;
}

interface CustomSelectProps<Value extends string> {
  id: string;
  label: string;
  value: Value;
  options: readonly CustomSelectOption<Value>[];
  onChange: (value: Value) => void;
  className?: string;
  description?: string;
  disabled?: boolean;
}

const navigationKeys: readonly SelectNavigationKey[] = [
  "ArrowDown",
  "ArrowUp",
  "Home",
  "End",
];

export function CustomSelect<Value extends string>({
  id,
  label,
  value,
  options,
  onChange,
  className = "",
  description,
  disabled = false,
}: CustomSelectProps<Value>) {
  const generatedId = useId();
  const labelId = `${id}-label`;
  const valueId = `${id}-value`;
  const descriptionId = description ? `${id}-description` : undefined;
  const listboxId = `${id}-listbox`;
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const typeaheadRef = useRef("");
  const typeaheadTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const selectedIndex = options.findIndex((option) => option.value === value);
  const selectedOption = options[selectedIndex];
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(
    selectedIndex >= 0 ? selectedIndex : 0,
  );

  useEffect(() => {
    if (!isOpen) return;
    listboxRef.current?.focus();

    const handlePointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !containerRef.current?.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen, selectedIndex]);

  useEffect(
    () => () => {
      if (typeaheadTimerRef.current) clearTimeout(typeaheadTimerRef.current);
    },
    [],
  );

  useEffect(() => {
    if (!isOpen || activeIndex < 0) return;
    document
      .getElementById(`${generatedId}-option-${activeIndex}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, generatedId, isOpen]);

  function close(restoreFocus = false) {
    setIsOpen(false);
    if (restoreFocus) {
      window.setTimeout(() => buttonRef.current?.focus(), 0);
    }
  }

  function commit(index: number) {
    const option = options[index];
    if (!option) return;
    onChange(option.value);
    close(true);
  }

  function handleTypeahead(key: string) {
    typeaheadRef.current += key;
    if (typeaheadTimerRef.current) clearTimeout(typeaheadTimerRef.current);
    typeaheadTimerRef.current = setTimeout(() => {
      typeaheadRef.current = "";
    }, 650);
    const match = findSelectOptionByPrefix(
      options.map((option) => option.label),
      typeaheadRef.current,
      activeIndex,
    );
    if (match >= 0) setActiveIndex(match);
  }

  function handleListboxKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (navigationKeys.includes(event.key as SelectNavigationKey)) {
      event.preventDefault();
      setActiveIndex((current) =>
        getNextSelectIndex(
          current,
          options.length,
          event.key as SelectNavigationKey,
        ),
      );
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      commit(activeIndex);
    } else if (event.key === "Escape") {
      event.preventDefault();
      close(true);
    } else if (event.key === "Tab") {
      close();
    } else if (
      event.key.length === 1 &&
      !event.altKey &&
      !event.ctrlKey &&
      !event.metaKey
    ) {
      handleTypeahead(event.key);
    }
  }

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <span className="block text-sm font-semibold text-ink" id={labelId}>
        {label}
      </span>
      <button
        ref={buttonRef}
        aria-controls={isOpen ? listboxId : undefined}
        aria-describedby={descriptionId}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-labelledby={`${labelId} ${valueId}`}
        className="mt-2 flex min-h-11 w-full items-center justify-between gap-3 rounded-[10px] border border-line-strong bg-canvas px-3 text-left text-sm font-medium text-ink transition-[border-color,background-color,box-shadow] duration-150 hover:border-accent/60 hover:bg-panel focus-visible:border-accent disabled:cursor-not-allowed disabled:opacity-55"
        disabled={disabled}
        id={id}
        onClick={() => {
          if (!isOpen) {
            setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
          }
          setIsOpen((open) => !open);
        }}
        onKeyDown={(event) => {
          if (navigationKeys.includes(event.key as SelectNavigationKey)) {
            event.preventDefault();
            setIsOpen(true);
            setActiveIndex(
              getNextSelectIndex(
                selectedIndex,
                options.length,
                event.key as SelectNavigationKey,
              ),
            );
          } else if (
            event.key.length === 1 &&
            !event.altKey &&
            !event.ctrlKey &&
            !event.metaKey
          ) {
            const match = findSelectOptionByPrefix(
              options.map((option) => option.label),
              event.key,
              selectedIndex,
            );
            if (match >= 0) {
              event.preventDefault();
              setActiveIndex(match);
              setIsOpen(true);
            }
          }
        }}
        type="button"
      >
        <span className="min-w-0 truncate" id={valueId}>
          {selectedOption?.label ?? "Select an option"}
        </span>
        <svg
          aria-hidden="true"
          className={`size-4 shrink-0 text-ink-subtle transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {description ? (
        <p
          className="mt-2 text-xs leading-5 text-ink-subtle"
          id={descriptionId}
        >
          {description}
        </p>
      ) : null}

      {isOpen ? (
        <div
          ref={listboxRef}
          aria-activedescendant={`${generatedId}-option-${activeIndex}`}
          aria-labelledby={labelId}
          className="search-results-scrollbar absolute inset-x-0 top-[calc(100%+6px)] z-[70] max-h-64 min-w-48 overflow-y-auto rounded-card border border-line bg-panel p-1.5 shadow-[0_18px_50px_rgba(0,0,0,0.18)] outline-none"
          id={listboxId}
          onKeyDown={handleListboxKeyDown}
          role="listbox"
          tabIndex={0}
        >
          {options.map((option, index) => {
            const selected = option.value === value;
            const active = index === activeIndex;
            return (
              <button
                aria-selected={selected}
                className={`flex min-h-11 w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  active ? "bg-panel-muted text-ink" : "text-ink-muted"
                } ${selected ? "font-semibold" : "font-medium"}`}
                id={`${generatedId}-option-${index}`}
                key={option.value}
                onClick={() => commit(index)}
                onMouseEnter={() => setActiveIndex(index)}
                role="option"
                tabIndex={-1}
                type="button"
              >
                <span className="min-w-0">
                  <span className="block">{option.label}</span>
                  {option.description ? (
                    <span className="mt-0.5 block text-xs font-normal leading-5 text-ink-subtle">
                      {option.description}
                    </span>
                  ) : null}
                </span>
                <svg
                  aria-hidden="true"
                  className={`size-4 shrink-0 text-accent ${selected ? "opacity-100" : "opacity-0"}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                >
                  <path d="m5 12 4 4L19 6" />
                </svg>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
