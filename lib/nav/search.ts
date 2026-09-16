import type {
  NavCluster,
  NavConcept,
  NavEntry,
  NavGroup,
  NavSubject,
  NavTopic,
  SearchMode,
} from "./types";

export const BODY_QUERY_MIN_LENGTH = 3;

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

function filterEntry(entry: NavEntry, query: string, mode: SearchMode): NavEntry | null {
  switch (entry.kind) {
    case "topic":
      return topicMatches(entry.topic, query, mode) ? entry : null;
    case "subject": {
      const subject = filterSubject(entry.subject, query, mode);
      return subject ? { kind: "subject", subject } : null;
    }
    case "cluster": {
      const cluster = filterCluster(entry.cluster, query, mode);
      return cluster ? { kind: "cluster", subjectHref: entry.subjectHref, cluster } : null;
    }
    default: {
      const _never: never = entry;
      return _never;
    }
  }
}

function filterCluster(cluster: NavCluster, query: string, mode: SearchMode): NavCluster | null {
  if (matchesQuery(cluster.title, query)) {
    return cluster;
  }
  const topics = cluster.topics.filter((topic) => topicMatches(topic, query, mode));
  if (topics.length === 0) {
    return null;
  }
  return { ...cluster, topics };
}

function filterSubject(subject: NavSubject, query: string, mode: SearchMode): NavSubject | null {
  if (matchesQuery(subject.title, query) || matchesQuery(subject.blurb, query)) {
    return subject;
  }
  const clusters = subject.clusters
    .map((cluster) => filterCluster(cluster, query, mode))
    .filter((cluster): cluster is NavCluster => cluster !== null);
  if (clusters.length === 0) {
    return null;
  }
  return { ...subject, clusters };
}

export function filterNavGroups(
  groups: readonly NavGroup[],
  query: string,
  mode: SearchMode = "titles",
): readonly NavGroup[] {
  const normalized = query.trim().toLowerCase();
  if (normalized.length === 0) {
    return groups;
  }

  return groups
    .map((group) => {
      const keepLeaf =
        Boolean(group.leafTopic) &&
        (matchesQuery(group.title, normalized) ||
          (group.leafTopic ? topicMatches(group.leafTopic, normalized, mode) : false));
      const entries = group.entries
        .map((entry) => filterEntry(entry, normalized, mode))
        .filter((entry): entry is NavEntry => entry !== null);
      return {
        ...group,
        leafTopic: keepLeaf ? group.leafTopic : undefined,
        entries,
      };
    })
    .filter((group) => group.entries.length > 0 || Boolean(group.leafTopic));
}

export function firstSearchHref(
  groups: readonly NavGroup[],
  query: string,
  preferredPathname?: string,
  mode: SearchMode = "titles",
): string | null {
  const normalized = query.trim().toLowerCase();
  if (normalized.length === 0) {
    return null;
  }

  const topics = navTopics(groups);

  const titleHit = topics.find((topic) => matchesQuery(topic.title, normalized));
  if (titleHit) {
    return titleHit.href;
  }

  for (const group of groups) {
    for (const entry of group.entries) {
      switch (entry.kind) {
        case "subject":
          if (matchesQuery(entry.subject.title, normalized)) {
            return entry.subject.href;
          }
          break;
        case "cluster":
          if (matchesQuery(entry.cluster.title, normalized)) {
            return entry.cluster.href;
          }
          break;
        case "topic":
          break;
        default: {
          const _never: never = entry;
          return _never;
        }
      }
    }
  }

  for (const group of groups) {
    for (const entry of group.entries) {
      switch (entry.kind) {
        case "subject": {
          const clusterHit = entry.subject.clusters.find((cluster) =>
            matchesQuery(cluster.title, normalized),
          );
          if (clusterHit) {
            return clusterHit.href;
          }
          break;
        }
        case "cluster":
        case "topic":
          break;
        default: {
          const _never: never = entry;
          return _never;
        }
      }
    }
  }

  const titleConceptHref = firstConceptHref(topics, preferredPathname, (concept) =>
    conceptTitleMatches(concept, normalized),
  );
  if (titleConceptHref) {
    return titleConceptHref;
  }

  const blurbHit = topics.find((topic) => matchesQuery(topic.blurb, normalized));
  if (blurbHit) {
    return blurbHit.href;
  }

  for (const group of groups) {
    for (const entry of group.entries) {
      switch (entry.kind) {
        case "subject":
          if (matchesQuery(entry.subject.blurb, normalized)) {
            return entry.subject.href;
          }
          break;
        case "cluster":
        case "topic":
          break;
        default: {
          const _never: never = entry;
          return _never;
        }
      }
    }
  }

  if (!includesNotes(mode)) {
    return null;
  }

  return firstConceptHref(topics, preferredPathname, (concept) =>
    conceptBodyMatches(concept, normalized),
  );
}

function firstConceptHref(
  topics: readonly NavTopic[],
  preferredPathname: string | undefined,
  matches: (concept: NavConcept) => boolean,
): string | null {
  if (preferredPathname) {
    const current = topics.find((topic) => topic.href === preferredPathname);
    const conceptHit = current?.concepts.find(matches);
    if (current && conceptHit) {
      return conceptHref(current.href, conceptHit.id);
    }
  }

  for (const topic of topics) {
    const conceptHit = topic.concepts.find(matches);
    if (conceptHit) {
      return conceptHref(topic.href, conceptHit.id);
    }
  }

  return null;
}
