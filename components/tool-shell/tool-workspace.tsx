import type { ReactNode } from "react";

interface ToolWorkspaceProps {
  children: ReactNode;
  title?: string;
}

export function ToolWorkspace({
  children,
  title = "Workspace",
}: ToolWorkspaceProps) {
  return (
    <section
      className="rounded-card border border-line bg-panel shadow-card"
      aria-labelledby="workspace-title"
    >
      <h2 className="sr-only" id="workspace-title">
        {title}
      </h2>
      <div className="p-4 sm:p-5 lg:p-6">{children}</div>
    </section>
  );
}
