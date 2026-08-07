import { adsConfig, type AdPlacement } from "@/lib/ads/config";

interface AdSlotProps {
  placement: AdPlacement;
}

const dimensions: Record<AdPlacement, string> = {
  "homepage-content": "min-h-24 sm:min-h-28",
  "category-content": "min-h-24 sm:min-h-28",
  "tool-after-content": "min-h-24 sm:min-h-28",
  sidebar: "min-h-64",
};

export function AdSlot({ placement }: AdSlotProps) {
  const slotId = adsConfig.slots[placement];
  if (!adsConfig.enabled || !adsConfig.providerId || !slotId) return null;

  return (
    <aside
      aria-label="Advertisement"
      className={`grid place-items-center rounded-card border border-line bg-panel-muted/40 ${dimensions[placement]}`}
      data-ad-placement={placement}
      data-ad-provider={adsConfig.providerId}
      data-ad-slot={slotId}
    >
      <span className="text-xs font-medium uppercase tracking-wider text-ink-subtle">
        Advertisement
      </span>
    </aside>
  );
}
