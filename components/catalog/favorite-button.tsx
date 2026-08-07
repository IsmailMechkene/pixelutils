"use client";

import { Icon } from "@/components/ui/icon";
import { useCatalogPreferenceList } from "@/hooks/use-catalog-preference";
import {
  FAVORITE_TOOLS_STORAGE_KEY,
  parseFavoriteToolSlugs,
  setFavoriteTool,
} from "@/lib/storage/catalog-preferences";

interface FavoriteButtonProps {
  slug: string;
  compact?: boolean;
}

export function FavoriteButton({ slug, compact = false }: FavoriteButtonProps) {
  const favorites = useCatalogPreferenceList(
    FAVORITE_TOOLS_STORAGE_KEY,
    parseFavoriteToolSlugs,
  );
  const isFavorite = favorites.includes(slug);
  const label = isFavorite ? "Remove from favorites" : "Add to favorites";

  return (
    <button
      aria-pressed={isFavorite}
      className={
        compact
          ? "control-icon"
          : "control-secondary gap-2 px-3 text-sm font-medium"
      }
      onClick={() => setFavoriteTool(slug, !isFavorite)}
      title={label}
      type="button"
    >
      <Icon
        className={`size-4 ${isFavorite ? "fill-current" : ""}`}
        name="star"
      />
      {compact ? <span className="sr-only">{label}</span> : label}
    </button>
  );
}
