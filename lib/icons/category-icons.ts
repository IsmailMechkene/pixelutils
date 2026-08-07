import {
  Binary,
  Calculator,
  Clock3,
  Code2,
  Globe2,
  Image,
  Palette,
  ShieldCheck,
  Type,
  type LucideIcon,
} from "lucide-react";

import type { CategoryIconId } from "./types";

export const categoryIcons = {
  "code-2": Code2,
  type: Type,
  binary: Binary,
  "globe-2": Globe2,
  image: Image,
  "shield-check": ShieldCheck,
  "clock-3": Clock3,
  calculator: Calculator,
  palette: Palette,
} satisfies Record<CategoryIconId, LucideIcon>;
