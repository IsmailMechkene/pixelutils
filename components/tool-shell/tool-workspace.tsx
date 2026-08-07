import type { ReactNode } from "react";

interface ToolWorkspaceProps {
  children: ReactNode;
  title?: string;
}

export function ToolWorkspace({ children, title = "Workspace" }: ToolWorkspaceProps) {
  return (
    <section
      className="rounded-card border border-line bg-panel shadow-[0_18px_45px_rgba(0,0,0,0.055)]"
      aria-labelledby="workspace-title"
    >
      <div className="border-b border-line px-5 py-4 sm:px-6">
        <h2 className="text-sm font-semibold text-ink" id="workspace-title">
          {title}
        </h2>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}
