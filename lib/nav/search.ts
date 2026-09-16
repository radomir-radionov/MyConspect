import type { NavConcept, NavEntry, NavGroup, NavTopic, SearchMode } from "./types";
import {
  BODY_QUERY_MIN_LENGTH,
  filterGroupsWithIndex,
  firstHrefWithIndex,
  searchIndexFor,
  trigramBodyHits,
  type HandbookSearchIndex,
} from "./searchIndex";

export { BODY_QUERY_MIN_LENGTH };

export function matchesQuery(haystack: string, query: string): boolean {
  return haystack.toLowerCase().includes(query);
}

function includesNotes(mode: SearchMode): boolean {
  switch (mode) {
    case "notes":
      return true;
    case "titles":
      return false;
    default: {
      const _never: never = mode;
      return _never;
    }
  }
}

function conceptTitleMatches(
  concept: Pick<NavConcept, "title" | "titleSearchText">,
  query: string,
): boolean {
  return (
    matchesQuery(concept.title, query) || matchesQuery(concept.titleSearchText ?? "", query)
  );
}

function conceptBodyMatches(concept: Pick<NavConcept, "searchText">, query: string): boolean {
  if (query.length < BODY_QUERY_MIN_LENGTH) {
    return false;
  }
  return matchesQuery(concept.searchText ?? "", query);
}

export function conceptMatchesQuery(
  concept: Pick<NavConcept, "title" | "titleSearchText" | "searchText">,
  query: string,
  mode: SearchMode = "titles",
): boolean {
  const normalized = query.trim().toLowerCase();
  if (normalized.length === 0) {
    return true;
  }
  if (conceptTitleMatches(concept, normalized)) {
    return true;
  }
  return includesNotes(mode) && conceptBodyMatches(concept, normalized);
}

const SNIPPET_PAD = 24;

export function conceptBodySnippet(
  concept: Pick<NavConcept, "title" | "titleSearchText" | "searchText">,
  query: string,
  mode: SearchMode = "titles",
): string | null {
  if (!includesNotes(mode)) {
    return null;
  }
  const normalized = query.trim().toLowerCase();
  if (conceptTitleMatches(concept, normalized) || !conceptBodyMatches(concept, normalized)) {
    return null;
  }
  const haystack = concept.searchText ?? "";
  const index = haystack.toLowerCase().indexOf(normalized);
  if (index === -1) {
    return null;
  }
  const start = Math.max(0, index - SNIPPET_PAD);
  const end = Math.min(haystack.length, index + normalized.length + SNIPPET_PAD);
  let snippet = haystack.slice(start, end).replace(/\s+/g, " ").trim();
  if (start > 0) {
    snippet = `…${snippet}`;
  }
  if (end < haystack.length) {
    snippet = `${snippet}…`;
  }
  return snippet;
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

export function topicMatches(topic: NavTopic, query: string, mode: SearchMode = "titles"): boolean {
  const normalized = query.trim().toLowerCase();
  if (normalized.length === 0) {
    return true;
  }
  return (
    matchesQuery(topic.title, normalized) ||
    matchesQuery(topic.blurb, normalized) ||
    topic.concepts.some((concept) => conceptMatchesQuery(concept, normalized, mode))
  );
}

export function navTopics(groups: readonly NavGroup[]): readonly NavTopic[] {
  const topics: NavTopic[] = [];
  for (const group of groups) {
    if (group.leafTopic) {
      topics.push(group.leafTopic);
    }
    for (const entry of group.entries) {
      topics.push(...topicsInEntry(entry));
    }
  }
  return topics;
}

function topicsInEntry(entry: NavEntry): readonly NavTopic[] {
  switch (entry.kind) {
    case "topic":
      return [entry.topic];
    case "subject":
      return entry.subject.clusters.flatMap((cluster) => cluster.topics);
    case "cluster":
      return entry.cluster.topics;
    default: {
      const _never: never = entry;
      return _never;
    }
  }
}

export type NavSearchResult = {
  readonly groups: readonly NavGroup[];
  readonly firstHref: string | null;
};

export function searchNav(
  groups: readonly NavGroup[],
  query: string,
  mode: SearchMode = "titles",
  preferredPathname?: string,
): NavSearchResult {
  const normalized = query.trim().toLowerCase();
  if (normalized.length === 0) {
    return { groups, firstHref: null };
  }

  const index = searchIndexFor(groups);
  const bodyHits = notesBodyHits(index, normalized, mode);
  return {
    groups: filterGroupsWithIndex(index, normalized, mode, bodyHits),
    firstHref: firstHrefWithIndex(index, normalized, mode, preferredPathname, bodyHits),
  };
}

export function filterNavGroups(
  groups: readonly NavGroup[],
  query: string,
  mode: SearchMode = "titles",
): readonly NavGroup[] {
  return searchNav(groups, query, mode).groups;
}

export function firstSearchHref(
  groups: readonly NavGroup[],
  query: string,
  preferredPathname?: string,
  mode: SearchMode = "titles",
): string | null {
  return searchNav(groups, query, mode, preferredPathname).firstHref;
}

function notesBodyHits(
  index: HandbookSearchIndex,
  query: string,
  mode: SearchMode,
): Set<number> | null {
  switch (mode) {
    case "notes":
      return trigramBodyHits(index, query);
    case "titles":
      return null;
    default: {
      const _never: never = mode;
      return _never;
    }
  }
}
