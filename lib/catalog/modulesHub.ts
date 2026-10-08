/** Modules topic (`ts-modules`) — handbook sections on the topic index. */
export const MODULES_TOPIC_SLUG = "ts-modules";

/** Section title → concept `<summary>` titles in handbook order. */
export const MODULES_TOPIC_SECTIONS: readonly {
  readonly section: string;
  readonly concepts: readonly string[];
}[] = [
  {
    section: "How JavaScript Modules are Defined",
    concepts: ["How JavaScript Modules are Defined", "Non-modules"],
  },
  {
    section: "Modules in TypeScript",
    concepts: [
      "Modules in TypeScript",
      "ES Module Syntax",
      "Additional Import Syntax",
      "CommonJS Syntax",
      "CommonJS and ES Modules interop",
      "TypeScript's Module Resolution Options",
      "TypeScript's Module Output Options",
      "TypeScript namespaces",
    ],
  },
];

const titleToSection = new Map<string, string>(
  MODULES_TOPIC_SECTIONS.flatMap(({ section, concepts }) =>
    concepts.map((title) => [title, section]),
  ),
);

export function isModulesTopicSlug(slug: string): boolean {
  return slug === MODULES_TOPIC_SLUG;
}

export function modulesConceptSection(title: string): string | undefined {
  return titleToSection.get(title);
}

export function withModulesConceptGroups<T extends { readonly title: string }>(
  items: readonly T[],
): (T & { group?: string })[] {
  return items.map((item) => {
    const group = modulesConceptSection(item.title);
    return group ? { ...item, group } : item;
  });
}
