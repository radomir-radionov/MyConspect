/** Browser Document topic (`js-browser`) — handbook sections on the topic index. */
export const BROWSER_DOCUMENT_TOPIC_SLUG = "js-browser-document";

/** Section title → concept `<summary>` titles in handbook order. */
export const BROWSER_DOCUMENT_TOPIC_SECTIONS: readonly {
  readonly section: string;
  readonly concepts: readonly string[];
}[] = [
  {
    section: "Environment",
    concepts: ["Script loading", "Browser environment"],
  },
  {
    section: "DOM tree",
    concepts: [
      "DOM tree",
      "DOM navigation",
      "Searching elements",
      "Node properties",
      "Attributes and properties",
    ],
  },
  {
    section: "Modifying the DOM",
    concepts: ["Changing the DOM", "Styles and classes"],
  },
  {
    section: "Size, scroll & coordinates",
    concepts: [
      "Element size and scroll",
      "Window size and scroll",
      "Coordinates",
    ],
  },
  {
    section: "BOM, forms & observers",
    concepts: [
      "BOM",
      "Text, forms, and dialogs",
      "MutationObserver",
      "Forms vs dialogs",
    ],
  },
];

const titleToSection = new Map<string, string>(
  BROWSER_DOCUMENT_TOPIC_SECTIONS.flatMap(({ section, concepts }) =>
    concepts.map((title) => [title, section]),
  ),
);

export function isBrowserDocumentTopicSlug(slug: string): boolean {
  return slug === BROWSER_DOCUMENT_TOPIC_SLUG;
}

export function browserDocumentConceptSection(
  title: string,
): string | undefined {
  return titleToSection.get(title);
}

export function withBrowserDocumentConceptGroups<
  T extends { readonly title: string },
>(items: readonly T[]): (T & { group?: string })[] {
  return items.map((item) => {
    const group = browserDocumentConceptSection(item.title);
    return group ? { ...item, group } : item;
  });
}
