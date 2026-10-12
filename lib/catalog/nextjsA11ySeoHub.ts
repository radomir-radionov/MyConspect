/** Next.js Accessibility, SEO & metadata (`nextjs-a11y-seo`) — handbook section groups. */
export const NEXTJS_A11Y_SEO_TOPIC_SLUG = "nextjs-a11y-seo";

/** Section title → concept `<summary>` titles in handbook order. */
export const NEXTJS_A11Y_SEO_TOPIC_SECTIONS: readonly {
  readonly section: string;
  readonly concepts: readonly string[];
}[] = [
  {
    section: "Metadata API",
    concepts: [
      "Static metadata",
      "Title template",
      "metadataBase",
      "alternates (canonical and hreflang)",
      "generateMetadata",
      "Metadata merging",
      "viewport and generateViewport",
      "metadata.robots",
      "File-based metadata",
      "manifest.ts",
    ],
  },
  {
    section: "SEO & discovery",
    concepts: ["sitemap.ts", "robots.ts", "JSON-LD"],
  },
  {
    section: "Accessibility",
    concepts: [
      "Root layout and document language",
      "Route announcer",
      "Focus and client navigation",
      "ESLint and jsx-a11y",
    ],
  },
];

const titleToSection = new Map<string, string>(
  NEXTJS_A11Y_SEO_TOPIC_SECTIONS.flatMap(({ section, concepts }) =>
    concepts.map((title) => [title, section]),
  ),
);

export function isNextjsA11ySeoTopicSlug(slug: string): boolean {
  return slug === NEXTJS_A11Y_SEO_TOPIC_SLUG;
}

export function nextjsA11ySeoConceptSection(title: string): string | undefined {
  return titleToSection.get(title);
}

export function withNextjsA11ySeoConceptGroups<
  T extends { readonly title: string },
>(items: readonly T[]): (T & { group?: string })[] {
  return items.map((item) => {
    const group = nextjsA11ySeoConceptSection(item.title);
    return group ? { ...item, group } : item;
  });
}
