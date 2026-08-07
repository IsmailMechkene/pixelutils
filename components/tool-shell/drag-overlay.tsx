import { Icon } from "@/components/ui/icon";

export function DragOverlay({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <span className="pointer-events-none absolute inset-2 grid place-items-center rounded-control bg-accent-soft text-sm font-semibold text-accent">
      <span className="inline-flex items-center gap-2">
        <Icon className="size-4" name="file-up" />
        Drop to add
      </span>
    </span>
  );
}
