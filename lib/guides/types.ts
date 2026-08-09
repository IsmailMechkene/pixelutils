export interface GuideSection {
  readonly id: string;
  readonly heading: string;
  readonly paragraphs: readonly string[];
  readonly steps?: readonly string[];
  readonly codeExample?: {
    readonly label: string;
    readonly language: string;
    readonly value: string;
  };
}

export interface GuideDefinition {
  readonly slug: string;
  readonly title: string;
  readonly description: string;
  readonly summary: string;
  readonly category: string;
  readonly readingTime: string;
  readonly byline: string;
  readonly publishedAt: string;
  readonly updatedAt: string;
  readonly primaryToolSlug: string;
  readonly relatedToolSlugs: readonly string[];
  readonly relatedGuideSlugs: readonly string[];
  readonly sections: readonly GuideSection[];
}
