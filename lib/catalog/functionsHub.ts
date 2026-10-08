/** Functions topic (`ts-functions`) — handbook sections on the topic index. */
export const FUNCTIONS_TOPIC_SLUG = "ts-functions";

/** Section title → concept `<summary>` titles in handbook order. */
export const FUNCTIONS_TOPIC_SECTIONS: readonly {
  readonly section: string;
  readonly concepts: readonly string[];
}[] = [
  {
    section: "Generic Functions",
    concepts: [
      "Generic Functions",
      "Inference",
      "Constraints",
      "Working with Constrained Values",
      "Specifying Type Arguments",
      "Guidelines for Writing Good Generic Functions",
    ],
  },
  {
    section: "Optional Parameters",
    concepts: ["Optional Parameters", "Optional Parameters in Callbacks"],
  },
  {
    section: "Function Overloads",
    concepts: [
      "Function Overloads",
      "Overload Signatures and the Implementation Signature",
      "Writing Good Overloads",
    ],
  },
  {
    section: "Other Types to Know About",
    concepts: [
      "Other Types to Know About",
      "void",
      "object",
      "unknown",
      "never",
      "Function",
    ],
  },
  {
    section: "Rest Parameters and Arguments",
    concepts: [
      "Rest Parameters and Arguments",
      "Rest Parameters",
      "Rest Arguments",
    ],
  },
];

const titleToSection = new Map<string, string>(
  FUNCTIONS_TOPIC_SECTIONS.flatMap(({ section, concepts }) =>
    concepts.map((title) => [title, section]),
  ),
);

export function isFunctionsTopicSlug(slug: string): boolean {
  return slug === FUNCTIONS_TOPIC_SLUG;
}

export function functionsConceptSection(title: string): string | undefined {
  return titleToSection.get(title);
}

export function withFunctionsConceptGroups<
  T extends { readonly title: string },
>(items: readonly T[]): (T & { group?: string })[] {
  return items.map((item) => {
    const group = functionsConceptSection(item.title);
    return group ? { ...item, group } : item;
  });
}
