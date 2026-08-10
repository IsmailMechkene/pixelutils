"use client";

import { useLayoutEffect, useState } from "react";

import type { ToolCardItem } from "@/lib/catalog/types";
import {
  FAVORITE_TOOLS_STORAGE_KEY,
  getPreferenceSnapshot,
  parseFavoriteToolSlugs,
  subscribeToCatalogPreferences,
} from "@/lib/storage/catalog-preferences";

import { ToolCard } from "./tool-card";

interface FavoriteToolsProps {
  tools: readonly ToolCardItem[];
}

export function FavoriteTools({ tools }: FavoriteToolsProps) {
  const [favoriteSlugs, setFavoriteSlugs] = useState<string[]>([]);

  useLayoutEffect(() => {
    const updateFavorites = () => {
      setFavoriteSlugs(
        parseFavoriteToolSlugs(getPreferenceSnapshot(FAVORITE_TOOLS_STORAGE_KEY)),
      );
    };

    updateFavorites();
    return subscribeToCatalogPreferences(updateFavorites);
  }, []);

  if (favoriteSlugs.length === 0) return null;

  const toolsBySlug = new Map(tools.map((tool) => [tool.slug, tool]));
  const favoriteTools = favoriteSlugs
    .map((slug) => toolsBySlug.get(slug))
    .filter((tool): tool is ToolCardItem => tool !== undefined)
    .slice(0, 6);
  if (favoriteTools.length === 0) return null;

  return (
    <section
      aria-labelledby="favorite-tools-title"
      className="page-section pt-14 sm:pt-16"
    >
      <p className="section-eyebrow">Saved on this device</p>
      <h2 className="section-title" id="favorite-tools-title">
        Favorite tools
      </h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {favoriteTools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </section>
  );
}
