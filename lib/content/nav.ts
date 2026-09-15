import type { TrackId } from "@/lib/content/catalog";

export type NavConcept = {
  readonly id: string;
  readonly title: string;
};

export type NavTopic = {
  readonly slug: string;
  readonly href: string;
  readonly title: string;
  readonly blurb: string;
  readonly concepts: readonly NavConcept[];
};

export type NavGroup = {
  readonly id: TrackId;
  readonly title: string;
  readonly href: string;
  readonly topics: readonly NavTopic[];
};

export type ChromeCopy = {
  readonly searchPlaceholder: string;
  readonly searchEmpty: string;
  readonly clearSearch: string;
  readonly topicsNav: string;
  readonly openMenu: string;
  readonly closeMenu: string;
  readonly instructions: string;
};

export const INSTRUCTIONS_HREF = "/instructions";

export const CHROME: ChromeCopy = {
  searchPlaceholder: "Search topics and concepts…",
  searchEmpty: "No topics or concepts match that search.",
  clearSearch: "Clear search",
  topicsNav: "Topics",
  openMenu: "Open topics",
  closeMenu: "Close topics",
  instructions: "Instructions",
};

export function matchesQuery(haystack: string, query: string): boolean {
  return haystack.toLowerCase().includes(query);
}

export function conceptHref(topicHrefValue: string, conceptId: string): string {
  return `${topicHrefValue}#${conceptId}`;
}

export function splitHref(href: string): { pathname: string; hash: string } {
  const hashIndex = href.indexOf("#");
  if (hashIndex === -1) {
    return { pathname: href, hash: "" };
  }
  return { pathname: href.slice(0, hashIndex), hash: href.slice(hashIndex) };
}

export function topicMatches(topic: NavTopic, query: string): boolean {
  const normalized = query.trim().toLowerCase();
  if (normalized.length === 0) {
    return true;
  }
  return (
    matchesQuery(topic.title, normalized) ||
    matchesQuery(topic.blurb, normalized) ||
    topic.concepts.some((concept) => matchesQuery(concept.title, normalized))
  );
}

export function filterNavGroups(
  groups: readonly NavGroup[],
  query: string,
): readonly NavGroup[] {
  const normalized = query.trim().toLowerCase();
  if (normalized.length === 0) {
    return groups;
  }

  return groups
    .map((group) => ({
      ...group,
      topics: group.topics.filter((topic) => topicMatches(topic, query)),
    }))
    .filter((group) => group.topics.length > 0);
}

export function firstSearchHref(
  groups: readonly NavGroup[],
  query: string,
  preferredPathname?: string,
): string | null {
  const normalized = query.trim().toLowerCase();
  if (normalized.length === 0) {
    return null;
  }

  for (const group of groups) {
    const titleHit = group.topics.find((topic) => matchesQuery(topic.title, normalized));
    if (titleHit) {
      return titleHit.href;
    }
  }

  if (preferredPathname) {
    for (const group of groups) {
      const current = group.topics.find((topic) => topic.href === preferredPathname);
      const conceptHit = current?.concepts.find((concept) => matchesQuery(concept.title, normalized));
      if (current && conceptHit) {
        return conceptHref(current.href, conceptHit.id);
      }
    }
  }

  for (const group of groups) {
    for (const topic of group.topics) {
      const conceptHit = topic.concepts.find((concept) => matchesQuery(concept.title, normalized));
      if (conceptHit) {
        return conceptHref(topic.href, conceptHit.id);
      }
    }
  }

  for (const group of groups) {
    const blurbHit = group.topics.find((topic) => matchesQuery(topic.blurb, normalized));
    if (blurbHit) {
      return blurbHit.href;
    }
  }

  return null;
}
