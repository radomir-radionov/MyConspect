import type {
  NavCluster,
  NavEntry,
  NavGroup,
  NavSubject,
  NavTopic,
} from "@/lib/nav";
import { navSubjectClusters } from "@/lib/nav/subjectClusters";
import { hashIdFrom } from "@/lib/nav/navUtils";
import { isActiveTrack } from "./active";
import { crumbsForPath } from "./crumbs";
import { isTopicAliasCluster } from "./shared";

export type NavStep = {
  readonly pathname: string;
  readonly hash: string;
};

function topicsFromEntry(entry: NavEntry): readonly NavTopic[] {
  switch (entry.kind) {
    case "topic":
      return [entry.topic];
    case "subject":
      return navSubjectClusters(entry.subject).flatMap(
        (cluster) => cluster.topics,
      );
    case "cluster":
      return entry.cluster.topics;
    default: {
      const _never: never = entry;
      return _never;
    }
  }
}

export function collectTopicsForGroup(group: NavGroup): readonly NavTopic[] {
  if (group.leafTopic) {
    return [group.leafTopic];
  }
  const topics: NavTopic[] = [];
  for (const entry of group.entries) {
    topics.push(...topicsFromEntry(entry));
  }
  return topics;
}

function appendTopicSteps(chain: NavStep[], topic: NavTopic): void {
  const topicIndex: NavStep = { pathname: topic.href, hash: "" };
  const last = chain[chain.length - 1];
  const skipTopicIndex =
    last !== undefined &&
    last.pathname === topicIndex.pathname &&
    last.hash === topicIndex.hash;

  if (topic.concepts.length <= 1) {
    if (!skipTopicIndex) {
      chain.push(topicIndex);
    }
    return;
  }

  if (!skipTopicIndex) {
    chain.push(topicIndex);
  }
  for (const concept of topic.concepts) {
    chain.push({ pathname: topic.href, hash: concept.id });
  }
}

function findTopicInGroup(group: NavGroup, pathname: string): NavTopic | null {
  for (const topic of collectTopicsForGroup(group)) {
    if (topic.href === pathname) {
      return topic;
    }
  }
  return null;
}

function findSubjectForPath(
  group: NavGroup,
  pathname: string,
): NavSubject | null {
  for (const entry of group.entries) {
    if (entry.kind !== "subject") {
      continue;
    }
    if (entry.subject.href === pathname) {
      return entry.subject;
    }
    for (const cluster of navSubjectClusters(entry.subject)) {
      if (cluster.topics.some((topic) => topic.href === pathname)) {
        return entry.subject;
      }
    }
  }
  return null;
}

type ClusterScope = {
  readonly subjectHref: string;
  readonly cluster: NavCluster;
};

function findClusterForPath(
  group: NavGroup,
  pathname: string,
): ClusterScope | null {
  for (const entry of group.entries) {
    switch (entry.kind) {
      case "cluster":
        if (entry.cluster.topics.some((topic) => topic.href === pathname)) {
          return { subjectHref: entry.subjectHref, cluster: entry.cluster };
        }
        break;
      case "subject":
        for (const cluster of navSubjectClusters(entry.subject)) {
          if (cluster.topics.some((topic) => topic.href === pathname)) {
            return { subjectHref: entry.subject.href, cluster };
          }
        }
        break;
      default:
        break;
    }
  }
  return null;
}

function findClusterOnHub(
  group: NavGroup,
  subject: NavSubject | null,
  hash: string,
): ClusterScope | null {
  const clusterId = hashIdFrom(hash);
  if (!clusterId) {
    return null;
  }
  if (subject) {
    const cluster = navSubjectClusters(subject).find(
      (item) => item.id === clusterId,
    );
    if (cluster) {
      return { subjectHref: subject.href, cluster };
    }
    return null;
  }
  for (const entry of group.entries) {
    if (entry.kind === "cluster" && entry.cluster.id === clusterId) {
      return { subjectHref: entry.subjectHref, cluster: entry.cluster };
    }
  }
  return null;
}

function buildTrackHubChain(group: NavGroup): NavStep[] {
  const chain: NavStep[] = [{ pathname: group.href, hash: "" }];
  if (group.leafTopic) {
    appendTopicSteps(chain, group.leafTopic);
    return chain;
  }

  const hasNestedSubjects = group.entries.some(
    (entry) => entry.kind === "subject" && entry.subject.href !== group.href,
  );
  if (hasNestedSubjects) {
    for (const entry of group.entries) {
      if (entry.kind === "subject") {
        chain.push({ pathname: entry.subject.href, hash: "" });
      } else if (entry.kind === "topic") {
        chain.push({ pathname: entry.topic.href, hash: "" });
      }
    }
    return chain;
  }

  for (const topic of collectTopicsForGroup(group)) {
    appendTopicSteps(chain, topic);
  }
  return chain;
}

function buildSubjectChain(subject: NavSubject): NavStep[] {
  const chain: NavStep[] = [{ pathname: subject.href, hash: "" }];
  for (const cluster of navSubjectClusters(subject)) {
    for (const topic of cluster.topics) {
      appendTopicSteps(chain, topic);
    }
  }
  return chain;
}

function buildClusterChain(
  subjectHref: string,
  cluster: NavCluster,
): NavStep[] {
  const chain: NavStep[] = [];
  if (!isTopicAliasCluster(cluster)) {
    chain.push({ pathname: subjectHref, hash: cluster.id });
  }
  for (const topic of cluster.topics) {
    appendTopicSteps(chain, topic);
  }
  return chain;
}

function buildFullTrackChain(group: NavGroup): NavStep[] {
  const chain: NavStep[] = [{ pathname: group.href, hash: "" }];
  for (const topic of collectTopicsForGroup(group)) {
    appendTopicSteps(chain, topic);
  }
  return chain;
}

export function navChainForPath(
  groups: readonly NavGroup[],
  pathname: string,
  hash: string,
): readonly NavStep[] | null {
  const group = groups.find((item) => isActiveTrack(pathname, item.href));
  if (!group) {
    return null;
  }

  const subject = findSubjectForPath(group, pathname);

  if (pathname === group.href) {
    const clusterOnHub = findClusterOnHub(group, subject, hash);
    if (clusterOnHub) {
      return buildClusterChain(clusterOnHub.subjectHref, clusterOnHub.cluster);
    }
    return buildTrackHubChain(group);
  }

  if (subject && pathname === subject.href) {
    const clusterOnHub = findClusterOnHub(group, subject, hash);
    if (clusterOnHub) {
      return buildClusterChain(clusterOnHub.subjectHref, clusterOnHub.cluster);
    }
    return buildSubjectChain(subject);
  }

  const clusterMatch = findClusterForPath(group, pathname);
  if (clusterMatch && findTopicInGroup(group, pathname)) {
    return buildClusterChain(clusterMatch.subjectHref, clusterMatch.cluster);
  }

  if (findTopicInGroup(group, pathname)) {
    return buildFullTrackChain(group);
  }

  return null;
}

export function navChainIndex(
  chain: readonly NavStep[],
  pathname: string,
  hash: string,
): number {
  const hashId = hashIdFrom(hash);
  return chain.findIndex(
    (step) => step.pathname === pathname && step.hash === hashId,
  );
}

function stepHref(step: NavStep): string {
  return step.hash ? `${step.pathname}#${step.hash}` : step.pathname;
}

function wrapToFirstClusterStep(chain: readonly NavStep[]): NavStep | null {
  if (chain.length <= 1) {
    return null;
  }
  const first = chain[0];
  const second = chain[1];
  if (
    first &&
    second &&
    first.hash === "" &&
    first.pathname === second.pathname &&
    chain.every((step) => step.pathname === first.pathname)
  ) {
    return second;
  }
  return first ?? null;
}

function shouldWrapClusterAtBoundary(cluster: NavCluster): boolean {
  return cluster.topics.length === 1;
}

function firstTopicStep(topic: NavTopic): NavStep {
  if (topic.concepts.length <= 1) {
    return { pathname: topic.href, hash: "" };
  }
  const first = topic.concepts[0];
  return { pathname: topic.href, hash: first?.id ?? "" };
}

function firstClusterStep(cluster: NavCluster): NavStep | null {
  const firstTopic = cluster.topics[0];
  if (!firstTopic) {
    return null;
  }
  return firstTopicStep(firstTopic);
}

function lastClusterStep(cluster: NavCluster): NavStep | null {
  const lastTopic = cluster.topics[cluster.topics.length - 1];
  if (!lastTopic) {
    return null;
  }
  if (lastTopic.concepts.length <= 1) {
    return { pathname: lastTopic.href, hash: "" };
  }
  const lastConcept = lastTopic.concepts[lastTopic.concepts.length - 1];
  if (!lastConcept) {
    return null;
  }
  return { pathname: lastTopic.href, hash: lastConcept.id };
}

function adjacentCluster(
  subject: NavSubject,
  clusterId: string,
  delta: -1 | 1,
): NavCluster | null {
  const clusters = navSubjectClusters(subject);
  const index = clusters.findIndex((item) => item.id === clusterId);
  if (index < 0) {
    return null;
  }
  const nextIndex = index + delta;
  if (nextIndex < 0 || nextIndex >= clusters.length) {
    return null;
  }
  return clusters[nextIndex] ?? null;
}

function resolveSubjectForClusterNav(
  group: NavGroup,
  pathname: string,
): NavSubject | null {
  const fromPath = findSubjectForPath(group, pathname);
  if (fromPath) {
    return fromPath;
  }
  const clusterScope = findClusterForPath(group, pathname);
  if (!clusterScope) {
    return null;
  }
  for (const entry of group.entries) {
    if (
      entry.kind === "subject" &&
      entry.subject.href === clusterScope.subjectHref
    ) {
      return entry.subject;
    }
  }
  return null;
}

function crossClusterStep(
  groups: readonly NavGroup[],
  pathname: string,
  cluster: NavCluster,
  delta: -1 | 1,
): NavStep | null {
  const group = groups.find((item) => isActiveTrack(pathname, item.href));
  if (!group) {
    return null;
  }
  const subject = resolveSubjectForClusterNav(group, pathname);
  if (!subject) {
    return null;
  }
  const neighbor = adjacentCluster(subject, cluster.id, delta);
  if (!neighbor) {
    return null;
  }
  return delta > 0 ? firstClusterStep(neighbor) : lastClusterStep(neighbor);
}

function isLastConceptStepInTopic(
  chain: readonly NavStep[],
  current: NavStep,
): boolean {
  if (!current.hash) {
    return false;
  }
  let lastConcept: NavStep | null = null;
  for (const step of chain) {
    if (step.pathname === current.pathname && step.hash !== "") {
      lastConcept = step;
    }
  }
  return lastConcept?.hash === current.hash;
}

export function siblingNavHrefForPath(
  groups: readonly NavGroup[],
  pathname: string,
  hash: string,
  delta: -1 | 1,
  homeHref: string,
): string | null {
  const chain = navChainForPath(groups, pathname, hash);
  if (!chain || chain.length === 0) {
    return null;
  }

  const index = navChainIndex(chain, pathname, hash);
  if (index < 0) {
    return null;
  }

  const group = groups.find((item) => isActiveTrack(pathname, item.href));
  const clusterScope = group ? findClusterForPath(group, pathname) : null;
  const cluster = clusterScope?.cluster ?? null;

  const nextIndex = index + delta;
  if (nextIndex < 0) {
    if (delta < 0 && cluster && !shouldWrapClusterAtBoundary(cluster)) {
      const step = crossClusterStep(groups, pathname, cluster, -1);
      return step ? stepHref(step) : null;
    }
    return null;
  }
  if (nextIndex >= chain.length) {
    if (delta > 0) {
      const current = chain[index];
      if (current?.hash) {
        return stepHref({ pathname: current.pathname, hash: "" });
      }
      if (cluster && !shouldWrapClusterAtBoundary(cluster)) {
        const step = crossClusterStep(groups, pathname, cluster, 1);
        if (step) {
          return stepHref(step);
        }
      }
      const step = wrapToFirstClusterStep(chain);
      return step ? stepHref(step) : null;
    }
    return null;
  }

  const step = chain[nextIndex];
  if (!step) {
    return null;
  }
  const current = chain[index];
  if (delta > 0 && current?.hash && isLastConceptStepInTopic(chain, current)) {
    return stepHref({ pathname: current.pathname, hash: "" });
  }
  return stepHref(step);
}

export function adjacentConceptId(
  conceptIds: readonly string[],
  currentId: string,
  delta: -1 | 1,
): string | null {
  if (conceptIds.length === 0) {
    return null;
  }
  const index = conceptIds.indexOf(currentId);
  const fromIndex = index < 0 ? (delta > 0 ? -1 : conceptIds.length) : index;
  const nextIndex = fromIndex + delta;
  if (nextIndex < 0 || nextIndex >= conceptIds.length) {
    return null;
  }
  return conceptIds[nextIndex] ?? null;
}
export function parentHrefForPath(
  groups: readonly NavGroup[],
  pathname: string,
  hash: string,
  labels: { home: string; instructions: string },
): string | null {
  const crumbs = crumbsForPath(groups, pathname, hash, labels);
  for (let index = crumbs.length - 2; index >= 0; index -= 1) {
    const href = crumbs[index]?.href;
    if (href) {
      return href;
    }
  }
  return null;
}
