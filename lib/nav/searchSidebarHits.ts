import {
  conceptBodySnippet,
  conceptHref,
  conceptMatchesQuery,
  matchesQuery,
} from "./search";
import { navSubjectClusters } from "./subjectClusters";
import type {
  NavCluster,
  NavConcept,
  NavEntry,
  NavGroup,
  NavSubject,
  NavTopic,
  SearchMode,
} from "./types";

export type SearchSidebarHit = {
  readonly href: string;
  readonly concept: NavConcept;
  readonly topic: NavTopic;
  readonly topicHref: string;
  readonly context: string;
  readonly snippet: string | null;
};

function sameTitle(left: string, right: string): boolean {
  return left.trim().toLowerCase() === right.trim().toLowerCase();
}

function isDuplicateConceptTitle(
  topicTitle: string,
  conceptTitle: string,
): boolean {
  const topic = topicTitle.trim().toLowerCase();
  const concept = conceptTitle.trim().toLowerCase();
  return (
    topic === concept ||
    concept.startsWith(`${topic} `) ||
    topic.startsWith(`${concept} `)
  );
}

function visibleConcepts(
  topic: NavTopic,
  query: string,
  mode: SearchMode,
): readonly NavConcept[] {
  const needle = query.trim().toLowerCase();
  const matched =
    needle.length === 0
      ? topic.concepts
      : topic.concepts.filter((concept) =>
          conceptMatchesQuery(concept, needle, mode),
        );
  const only = matched.length === 1 ? matched[0] : undefined;
  if (only && isDuplicateConceptTitle(topic.title, only.title)) {
    if (
      mode === "notes" &&
      needle.length > 0 &&
      conceptBodySnippet(only, query, mode)
    ) {
      return matched;
    }
    return [];
  }
  return matched;
}

function contextLabel(parts: readonly string[]): string {
  const labels: string[] = [];
  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) {
      continue;
    }
    if (labels.some((label) => sameTitle(label, trimmed))) {
      continue;
    }
    labels.push(trimmed);
  }
  return labels.join(" · ");
}

function pushTopicHits(
  hits: SearchSidebarHit[],
  topic: NavTopic,
  contextParts: readonly string[],
  query: string,
  mode: SearchMode,
) {
  const concepts = visibleConcepts(topic, query, mode);
  const context = contextLabel(contextParts);
  for (const concept of concepts) {
    hits.push({
      href: conceptHref(topic.href, concept.id),
      concept,
      topic,
      topicHref: topic.href,
      context,
      snippet: conceptBodySnippet(concept, query, mode),
    });
  }
}

function collectClusterHits(
  hits: SearchSidebarHit[],
  cluster: NavCluster,
  contextParts: readonly string[],
  query: string,
  mode: SearchMode,
) {
  const onlyTopic = cluster.topics.length === 1 ? cluster.topics[0] : null;
  if (onlyTopic && sameTitle(cluster.title, onlyTopic.title)) {
    pushTopicHits(hits, onlyTopic, contextParts, query, mode);
    return;
  }

  for (const topic of cluster.topics) {
    pushTopicHits(
      hits,
      topic,
      [...contextParts, cluster.title, topic.title],
      query,
      mode,
    );
  }
}

function collectSubjectHits(
  hits: SearchSidebarHit[],
  subject: NavSubject,
  query: string,
  mode: SearchMode,
) {
  for (const cluster of navSubjectClusters(subject)) {
    collectClusterHits(hits, cluster, [subject.title], query, mode);
  }
}

function collectEntryHits(
  hits: SearchSidebarHit[],
  entry: NavEntry,
  query: string,
  mode: SearchMode,
) {
  switch (entry.kind) {
    case "topic":
      pushTopicHits(hits, entry.topic, [entry.topic.title], query, mode);
      return;
    case "subject":
      collectSubjectHits(hits, entry.subject, query, mode);
      return;
    case "cluster":
      collectClusterHits(
        hits,
        entry.cluster,
        [entry.cluster.title],
        query,
        mode,
      );
      return;
    default: {
      const _never: never = entry;
      return _never;
    }
  }
}

export function collectGroupSearchHits(
  group: NavGroup,
  query: string,
  mode: SearchMode,
): readonly SearchSidebarHit[] {
  const needle = query.trim().toLowerCase();
  if (needle.length === 0) {
    return [];
  }

  const hits: SearchSidebarHit[] = [];
  if (group.leafTopic) {
    pushTopicHits(hits, group.leafTopic, [], query, mode);
  }
  if (group.hubTopic) {
    pushTopicHits(hits, group.hubTopic, [], query, mode);
  }
  for (const entry of group.entries) {
    collectEntryHits(hits, entry, query, mode);
  }

  return hits.filter(
    (hit) =>
      matchesQuery(hit.concept.title, needle) ||
      matchesQuery(hit.concept.titleSearchText ?? "", needle) ||
      hit.snippet !== null,
  );
}
