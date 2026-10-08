/** Types hub (`ts-types`) — child topics shown as sections on the hub page index. */
export const TYPES_HUB_SLUG = "ts-types";

export const TYPES_HUB_SECTIONS: readonly {
  readonly slug: string;
  readonly group: string;
}[] = [
  { slug: "ts-types-values", group: "Values" },
  { slug: "ts-types-shapes", group: "Object shapes" },
  { slug: "ts-types-combining", group: "Combining types" },
  { slug: "ts-types-safety", group: "Type safety" },
  { slug: "ts-types-code", group: "In your code" },
];

export const TYPES_HUB_REFERENCE_GROUP = "Reference";

export function isTypesHubSlug(slug: string): boolean {
  return slug === TYPES_HUB_SLUG;
}

export function isTypesHubSectionSlug(slug: string): boolean {
  return TYPES_HUB_SECTIONS.some((section) => section.slug === slug);
}

export function typesHubSectionGroup(slug: string): string | undefined {
  return TYPES_HUB_SECTIONS.find((section) => section.slug === slug)?.group;
}

export function withConceptGroup<T extends { group?: string }>(
  items: readonly T[],
  group: string,
): T[] {
  return items.map((item) => ({ ...item, group }));
}
