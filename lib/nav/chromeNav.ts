import type {
  NavCluster,
  NavConcept,
  NavEntry,
  NavGroup,
  NavRootSection,
  NavSubject,
  NavTopic,
} from "./types";

export function withoutSearchTextSections(
  sections: readonly NavRootSection[],
): NavRootSection[] {
  return sections.map((section) => ({
    ...section,
    groups: withoutSearchText(section.groups),
  }));
}

export function withoutConceptsSections(
  sections: readonly NavRootSection[],
): NavRootSection[] {
  return sections.map((section) => ({
    ...section,
    groups: withoutConcepts(section.groups),
  }));
}

export function withoutConcepts(groups: readonly NavGroup[]): NavGroup[] {
  return groups.map((group) => ({
    ...group,
    leafTopic: group.leafTopic ? chromeTopicShell(group.leafTopic) : undefined,
    hubTopic: group.hubTopic ? chromeTopicShell(group.hubTopic) : undefined,
    entries: group.entries.map(chromeEntryShell),
  }));
}

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

function chromeTopicShell(topic: NavTopic): NavTopic {
  return {
    slug: topic.slug,
    href: topic.href,
    title: topic.title,
    blurb: topic.blurb,
    concepts: [],
    ...(topic.hideSidebarConcepts ? { hideSidebarConcepts: true } : {}),
  };
}

function chromeEntryShell(entry: NavEntry): NavEntry {
  switch (entry.kind) {
    case "topic":
      return { kind: "topic", topic: chromeTopicShell(entry.topic) };
    case "subject":
      return { kind: "subject", subject: chromeSubjectShell(entry.subject) };
    case "cluster":
      return {
        kind: "cluster",
        subjectHref: entry.subjectHref,
        cluster: chromeClusterShell(entry.cluster),
      };
    default: {
      const _never: never = entry;
      return _never;
    }
  }
}

function chromeSubjectShell(subject: NavSubject): NavSubject {
  const mapClusters = (clusters: readonly NavCluster[]) =>
    clusters.map(chromeClusterShell);
  return {
    slug: subject.slug,
    href: subject.href,
    title: subject.title,
    blurb: subject.blurb,
    sections: subject.sections?.map((section) => ({
      id: section.id,
      title: section.title,
      defaultOpen: section.defaultOpen,
      collapsible: section.collapsible,
      flatNav: section.flatNav,
      clusters: mapClusters(section.clusters),
    })),
    clusters: mapClusters(subject.clusters),
    clustersAfterSections: subject.clustersAfterSections
      ? mapClusters(subject.clustersAfterSections)
      : undefined,
  };
}

function chromeClusterShell(cluster: NavCluster): NavCluster {
  return {
    id: cluster.id,
    title: cluster.title,
    href: cluster.href,
    topics: cluster.topics.map(chromeTopicShell),
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
