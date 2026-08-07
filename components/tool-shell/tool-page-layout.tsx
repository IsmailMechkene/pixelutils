import type { ReactNode } from "react";

import type { CategoryDefinition, ToolDefinition } from "@/lib/catalog/types";

import { Breadcrumbs } from "./breadcrumbs";
import { PrivacyBadge } from "./privacy-badge";
import { ToolHeader } from "./tool-header";

interface ToolPageLayoutProps {
  tool: ToolDefinition;
  category: CategoryDefinition;
  children: ReactNode;
}

export function ToolPageLayout({ tool, category, children }: ToolPageLayoutProps) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: `/categories/${category.slug}`, label: category.name },
          { label: tool.name },
        ]}
      />
      <div className="mt-7">
        <ToolHeader tool={tool} />
      </div>
      <div className="mt-6">
        <PrivacyBadge tool={tool} />
      </div>
      <div className="mt-8">{children}</div>
    </div>
  );
}
