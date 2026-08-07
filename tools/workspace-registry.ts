import type { ComponentType } from "react";

export interface ToolWorkspaceProps {
  slug: string;
}

export type ToolWorkspaceModule = {
  default: ComponentType<ToolWorkspaceProps>;
};

// Each entry must use a direct dynamic import so Next.js creates one isolated
// chunk per tool. Add a loader in the same change that publishes the tool.
export const toolWorkspaceLoaders: Readonly<
  Record<string, () => Promise<ToolWorkspaceModule>>
> = {};

export const toolWorkspaceSlugs = Object.freeze(
  Object.keys(toolWorkspaceLoaders),
);
