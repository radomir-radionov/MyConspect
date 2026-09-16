import type { NavCluster, NavEntry, NavGroup, NavSubject, NavTopic } from "./types";

export function matchesQuery(haystack: string, query: string): boolean {
  return haystack.toLowerCase().includes(query);
}

function conceptMatches(concept: { title: string; searchText?: string }, query: string): boolean {
  return matchesQuery(concept.title, query) || matchesQuery(concept.searchText ?? "", query);
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
    topic.concepts.some((concept) => conceptMatches(concept, normalized))
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

function filterEntry(entry: NavEntry, query: string): NavEntry | null {
  switch (entry.kind) {
    case "topic":
      return topicMatches(entry.topic, query) ? entry : null;
    case "subject": {
      const subject = filterSubject(entry.subject, query);
      return subject ? { kind: "subject", subject } : null;
    }
    case "cluster": {
      const cluster = filterCluster(entry.cluster, query);
      return cluster ? { kind: "cluster", subjectHref: entry.subjectHref, cluster } : null;
    }
    default: {
      const _never: never = entry;
      return _never;
    }
  }
}

function filterCluster(cluster: NavCluster, query: string): NavCluster | null {
  if (matchesQuery(cluster.title, query)) {
    return cluster;
  }
  const topics = cluster.topics.filter((topic) => topicMatches(topic, query));
  if (topics.length === 0) {
    return null;
  }
  return { ...cluster, topics };
}

function filterSubject(subject: NavSubject, query: string): NavSubject | null {
  if (matchesQuery(subject.title, query) || matchesQuery(subject.blurb, query)) {
    return subject;
  }
  const clusters = subject.clusters
    .map((cluster) => filterCluster(cluster, query))
    .filter((cluster): cluster is NavCluster => cluster !== null);
  if (clusters.length === 0) {
    return null;
  }
  return { ...subject, clusters };
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
    .map((group) => {
      const keepLeaf =
        Boolean(group.leafTopic) &&
        (matchesQuery(group.title, normalized) ||
          (group.leafTopic ? topicMatches(group.leafTopic, normalized) : false));
      const entries = group.entries
        .map((entry) => filterEntry(entry, normalized))
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

  if (preferredPathname) {
    const current = topics.find((topic) => topic.href === preferredPathname);
    const conceptHit = current?.concepts.find((concept) => conceptMatches(concept, normalized));
    if (current && conceptHit) {
      return conceptHref(current.href, conceptHit.id);
    }
  }

  for (const topic of topics) {
    const conceptHit = topic.concepts.find((concept) => conceptMatches(concept, normalized));
    if (conceptHit) {
      return conceptHref(topic.href, conceptHit.id);
    }
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

  return null;
}
