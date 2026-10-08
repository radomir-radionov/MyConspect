/** Object Types topic (`ts-objects`) — handbook sections on the topic index. */
export const OBJECTS_TOPIC_SLUG = "ts-objects";

/** Section title → concept `<summary>` titles in handbook order. */
export const OBJECTS_TOPIC_SECTIONS: readonly {
  readonly section: string;
  readonly concepts: readonly string[];
}[] = [
  {
    section: "Property Modifiers",
    concepts: [
      "Property Modifiers",
      "Optional Properties",
      "readonly Properties",
      "Index Signatures",
    ],
  },
  {
    section: "Generic Object Types",
    concepts: [
      "Generic Object Types",
      "The Array Type",
      "The ReadonlyArray Type",
      "Tuple Types",
      "readonly Tuple Types",
    ],
  },
];

const titleToSection = new Map<string, string>(
  OBJECTS_TOPIC_SECTIONS.flatMap(({ section, concepts }) =>
    concepts.map((title) => [title, section]),
  ),
);

export function isObjectsTopicSlug(slug: string): boolean {
  return slug === OBJECTS_TOPIC_SLUG;
}

export function objectsConceptSection(title: string): string | undefined {
  return titleToSection.get(title);
}

export function withObjectsConceptGroups<T extends { readonly title: string }>(
  items: readonly T[],
): (T & { group?: string })[] {
  return items.map((item) => {
    const group = objectsConceptSection(item.title);
    return group ? { ...item, group } : item;
  });
}
