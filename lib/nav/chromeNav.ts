import type {
  NavCluster,
  NavConcept,
  NavEntry,
  NavGroup,
  NavSubject,
  NavTopic,
} from "./types";

export function withoutSearchText(groups: readonly NavGroup[]): NavGroup[] {
  return groups.map((group) => ({
    ...group,
    leafTopic: group.leafTopic ? chromeTopic(group.leafTopic) : undefined,
    hubTopic: group.hubTopic ? chromeTopic(group.hubTopic) : undefined,
    entries: group.entries.map(chromeEntry),
  }));
}

function chromeEntry(entry: NavEntry): NavEntry {
  switch (entry.kind) {
    case "topic":
      return { kind: "topic", topic: chromeTopic(entry.topic) };
    case "subject":
      return { kind: "subject", subject: chromeSubject(entry.subject) };
    case "cluster":
      return {
        kind: "cluster",
        subjectHref: entry.subjectHref,
        cluster: chromeCluster(entry.cluster),
      };
    default: {
      const _never: never = entry;
      return _never;
    }
  }
}

function chromeSubject(subject: NavSubject): NavSubject {
  const mapClusters = (clusters: readonly NavCluster[]) =>
    clusters.map(chromeCluster);
  return {
    ...subject,
    sections: subject.sections?.map((section) => ({
      ...section,
      clusters: mapClusters(section.clusters),
    })),
    clusters: mapClusters(subject.clusters),
    clustersAfterSections: subject.clustersAfterSections
      ? mapClusters(subject.clustersAfterSections)
      : undefined,
  };
}

function chromeCluster(cluster: NavCluster): NavCluster {
  return {
    ...cluster,
    topics: cluster.topics.map(chromeTopic),
  };
}

function chromeTopic(topic: NavTopic): NavTopic {
  return {
    ...topic,
    concepts: topic.concepts.map(chromeConcept),
  };
}

function chromeConcept(concept: NavConcept): NavConcept {
  return {
    id: concept.id,
    title: concept.title,
    titleSearchText: concept.titleSearchText,
    interviewSection: concept.interviewSection,
    ...(concept.group ? { group: concept.group } : {}),
  };
}
