import { findTool } from "@/lib/catalog/registry";

import type { GuideDefinition } from "./types";

function isValidDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value));
}

function isValidSlug(value: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

export function validateGuideRegistry(guides: readonly GuideDefinition[]) {
  const issues: string[] = [];
  const slugs = new Set(guides.map((guide) => guide.slug));
  const titles = new Set<string>();
  const descriptions = new Set<string>();

  for (const guide of guides) {
    if (!isValidSlug(guide.slug)) issues.push(`Invalid guide slug "${guide.slug}".`);
    if (!guide.title.trim()) issues.push(`Guide "${guide.slug}" is missing a title.`);
    if (!guide.description.trim())
      issues.push(`Guide "${guide.slug}" is missing a description.`);
    if (!guide.summary.trim()) issues.push(`Guide "${guide.slug}" is missing a summary.`);
    if (!guide.byline.trim()) issues.push(`Guide "${guide.slug}" is missing a byline.`);
    if (!isValidDate(guide.publishedAt) || !isValidDate(guide.updatedAt))
      issues.push(`Guide "${guide.slug}" has an invalid publication date.`);
    if (guide.updatedAt < guide.publishedAt)
      issues.push(`Guide "${guide.slug}" is updated before publication.`);
    if (titles.has(guide.title.trim().toLowerCase()))
      issues.push(`Duplicate guide title "${guide.title}".`);
    if (descriptions.has(guide.description.trim().toLowerCase()))
      issues.push(`Duplicate guide description on "${guide.slug}".`);
    titles.add(guide.title.trim().toLowerCase());
    descriptions.add(guide.description.trim().toLowerCase());

    if (!findTool(guide.primaryToolSlug))
      issues.push(`Guide "${guide.slug}" has an unknown primary tool.`);
    for (const toolSlug of guide.relatedToolSlugs) {
      if (!findTool(toolSlug))
        issues.push(`Guide "${guide.slug}" references an unknown tool "${toolSlug}".`);
    }
    for (const guideSlug of guide.relatedGuideSlugs) {
      if (guideSlug === guide.slug || !slugs.has(guideSlug))
        issues.push(`Guide "${guide.slug}" has an invalid related-guide reference.`);
    }
    if (guide.sections.length === 0)
      issues.push(`Guide "${guide.slug}" has no editorial sections.`);
    const sectionIds = new Set<string>();
    for (const section of guide.sections) {
      if (!isValidSlug(section.id) || !section.heading.trim() || section.paragraphs.length === 0)
        issues.push(`Guide "${guide.slug}" has an incomplete section.`);
      if (sectionIds.has(section.id))
        issues.push(`Guide "${guide.slug}" has a duplicate section id "${section.id}".`);
      sectionIds.add(section.id);
    }
  }

  return issues;
}

export function assertValidGuideRegistry(guides: readonly GuideDefinition[]) {
  const issues = validateGuideRegistry(guides);
  if (issues.length > 0) {
    throw new Error(`Invalid guide registry:\n${issues.map((issue) => `- ${issue}`).join("\n")}`);
  }
}
