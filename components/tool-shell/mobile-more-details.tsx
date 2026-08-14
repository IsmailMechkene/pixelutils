"use client";

import { useEffect, useState, type ReactNode } from "react";

import { Icon } from "@/components/ui/icon";

interface MobileMoreDetailsProps {
  children: ReactNode;
}

const desktopQuery = "(min-width: 768px)";

export function MobileMoreDetails({ children }: MobileMoreDetailsProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(desktopQuery);
    const updateDisclosure = () => setIsOpen(mediaQuery.matches);

    updateDisclosure();
    mediaQuery.addEventListener("change", updateDisclosure);
    return () => mediaQuery.removeEventListener("change", updateDisclosure);
  }, []);

  return (
    <details
      className="group mt-10 md:mt-14"
      onToggle={(event) => setIsOpen(event.currentTarget.open)}
      open={isOpen}
    >
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between rounded-control border border-line bg-panel px-4 text-sm font-semibold text-ink marker:content-none md:hidden">
        More details
        <Icon
          className="size-4 shrink-0 text-ink-subtle transition-transform group-open:rotate-180"
          name="chevron-down"
        />
      </summary>
      <div className="mt-6 hidden grid-cols-[minmax(0,1fr)] gap-14 group-open:grid md:grid">
        {children}
      </div>
    </details>
  );
}
