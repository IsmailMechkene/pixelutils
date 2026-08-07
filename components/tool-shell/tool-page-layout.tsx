import type { ReactNode } from "react";

import { Icon } from "@/components/ui/icon";
import type { ToolDefinition } from "@/lib/catalog/types";

import { Breadcrumbs } from "./breadcrumbs";

interface ToolPageLayoutProps {
  tool: ToolDefinition;
  categoryName: string;
  children: ReactNode;
  relatedTools?: ReactNode;
}

export function ToolPageLayout({
  tool,
  categoryName,
  children,
  relatedTools,
}: ToolPageLayoutProps) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: `/categories/${tool.category}`, label: categoryName },
          { label: tool.name },
        ]}
      />
      <header className="mt-7 max-w-3xl">
        <div className="flex items-start gap-4">
          <span className="mt-1 grid size-11 shrink-0 place-items-center rounded-card bg-accent-soft text-accent">
            <Icon className="size-5" name={tool.icon} />
          </span>
          <div>
            <h1 className="text-3xl font-semibold tracking-[-0.035em] text-ink sm:text-4xl">
              {tool.name}
            </h1>
            <p className="mt-3 text-base leading-7 text-ink-muted sm:text-lg">
              {tool.longDescription}
            </p>
          </div>
        </div>
      </header>
      {tool.browserProcessing ? (
        <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-success-soft px-3 py-1.5 text-xs font-semibold text-success">
          <Icon className="size-4" name="shield" />
          {tool.privacyNote}
        </div>
      ) : null}
      <div className="mt-8">{children}</div>
      {relatedTools ? <div className="mt-14">{relatedTools}</div> : null}
    </div>
  );
}
