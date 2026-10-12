/** Browser Events topic (`js-events`) — handbook sections on the topic index. */
export const EVENTS_TOPIC_SLUG = "js-events";

/** Section title → concept `<summary>` titles in handbook order. */
export const EVENTS_TOPIC_SECTIONS: readonly {
  readonly section: string;
  readonly concepts: readonly string[];
}[] = [
  {
    section: "Event basics",
    concepts: [
      "Introduction to browser events",
      "Bubbling and capturing",
      "Event delegation",
      "Browser default actions",
      "Dispatching custom events",
    ],
  },
  {
    section: "UI events",
    concepts: [
      "Mouse events",
      "Mouseover and mouseenter",
      "Mouse drag and drop",
      "Pointer events",
      "Keyboard events",
      "Scrolling",
    ],
  },
  {
    section: "Forms",
    concepts: [
      "Form properties and methods",
      "Focus and blur",
      "change, input, and clipboard events",
      "Form submit",
    ],
  },
  {
    section: "Document loading",
    concepts: [
      "Page lifecycle events",
      "Script async and defer",
      "Resource onload and onerror",
    ],
  },
];

const titleToSection = new Map<string, string>(
  EVENTS_TOPIC_SECTIONS.flatMap(({ section, concepts }) =>
    concepts.map((title) => [title, section]),
  ),
);

export function isEventsTopicSlug(slug: string): boolean {
  return slug === EVENTS_TOPIC_SLUG;
}

export function eventsConceptSection(title: string): string | undefined {
  return titleToSection.get(title);
}

export function withEventsConceptGroups<T extends { readonly title: string }>(
  items: readonly T[],
): (T & { group?: string })[] {
  return items.map((item) => {
    const group = eventsConceptSection(item.title);
    return group ? { ...item, group } : item;
  });
}
