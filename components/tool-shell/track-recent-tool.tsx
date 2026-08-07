"use client";

import { useEffect } from "react";

import { recordRecentTool } from "@/lib/storage/tool-activity";

export function TrackRecentTool({ slug }: { slug: string }) {
  useEffect(() => {
    recordRecentTool(slug);
  }, [slug]);

  return null;
}
