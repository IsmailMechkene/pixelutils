import type { ComponentProps } from "react";

import { actionIcons } from "@/lib/icons/action-icons";
import { categoryIcons } from "@/lib/icons/category-icons";
import { toolIcons } from "@/lib/icons/tool-icons";
import type {
  ActionIconId,
  CategoryIconId,
  ToolIconId,
} from "@/lib/icons/types";

type LucideProps = Omit<
  ComponentProps<(typeof actionIcons)[ActionIconId]>,
  "ref"
>;

interface IconProps extends LucideProps {
  name: ActionIconId;
}

interface ToolIconProps extends LucideProps {
  name: ToolIconId;
}

interface CategoryIconProps extends LucideProps {
  name: CategoryIconId;
}

const sharedProps = {
  "aria-hidden": true,
  focusable: false,
  strokeWidth: 1.8,
} as const;

export function Icon({ name, ...props }: IconProps) {
  const LucideIcon = actionIcons[name];
  return <LucideIcon {...sharedProps} {...props} />;
}

export function ToolIcon({ name, ...props }: ToolIconProps) {
  const LucideIcon = toolIcons[name];
  return <LucideIcon {...sharedProps} {...props} />;
}

export function CategoryIcon({ name, ...props }: CategoryIconProps) {
  const LucideIcon = categoryIcons[name];
  return <LucideIcon {...sharedProps} {...props} />;
}
