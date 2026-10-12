/** Utility Types hub (`ts-utility-types`) — child topics on the hub index. */
export const UTILITY_TYPES_HUB_SLUG = "ts-utility-types";

export const UTILITY_TYPES_HUB_SECTIONS: readonly {
  readonly slug: string;
  readonly group: string;
}[] = [
  { slug: "ts-utility-object", group: "Object utilities" },
  {
    slug: "ts-utility-union-function",
    group: "Unions & functions",
  },
];

export const UTILITY_TYPES_HUB_REFERENCE_GROUP = "Reference";

export function isUtilityTypesHubSlug(slug: string): boolean {
  return slug === UTILITY_TYPES_HUB_SLUG;
}

export function isUtilityTypesHubSectionSlug(slug: string): boolean {
  return UTILITY_TYPES_HUB_SECTIONS.some((section) => section.slug === slug);
}

export function utilityTypesHubSectionGroup(slug: string): string | undefined {
  return UTILITY_TYPES_HUB_SECTIONS.find((section) => section.slug === slug)
    ?.group;
}
