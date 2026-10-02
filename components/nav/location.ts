import {
  INSTRUCTIONS_HREF,
  splitHref,
  type Crumb,
  type NavCluster,
  type NavConcept,
  type NavEntry,
  type NavGroup,
  type NavSubject,
  type NavTopic,
} from "@/lib/nav";
import { bookmarkMatchesPage } from "@/lib/nav/bookmarks";
import { navSubjectClusters } from "@/lib/nav/subjectClusters";
import {
  homeHref,
  localeFromPathname,
  stripLocalePrefix,
} from "@/lib/i18n/paths";
import { hashIdFrom } from "./hash";

export type NavLocation = {
  topicHref: string | null;
  subjectHref: string | null;
  clusterKey: string | null;
  sectionKey: string | null;
};

export function isHomePath(pathname: string): boolean {
  return stripLocalePrefix(pathname).path === "/";
}

export function isActiveHref(pathname: string, href: string): boolean {
  return pathname === href;
}

export function isBookmarkActive(
  pathname: string,
  activeConceptId: string,
  href: string,
  conceptId?: string,
): boolean {
  return bookmarkMatchesPage(pathname, activeConceptId, href, conceptId);
}

export function isActiveTrack(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function isConceptActiveOnPage(
  pathname: string,
  topicHref: string,
  conceptId: string,
  activeConceptId: string,
): boolean {
  return (
    activeConceptId.length > 0 &&
    pathname === topicHref &&
    conceptId === activeConceptId
  );
}

export function isOnSubjectPath(
  pathname: string,
  subject: NavSubject,
): boolean {
  if (pathname === subject.href) {
    return true;
  }
  for (const cluster of navSubjectClusters(subject)) {
    if (cluster.topics.some((topic) => topic.href === pathname)) {
      return true;
    }
  }
  return false;
}

export function clusterKey(subjectHref: string, clusterId: string) {
  return `${subjectHref}#${clusterId}`;
}

export function sectionKey(subjectHref: string, sectionId: string) {
  return `${subjectHref}#${sectionId}`;
}

export function closedSectionKey(subjectHref: string, sectionId: string) {
  return `!${sectionKey(subjectHref, sectionId)}`;
}

export function isNavSectionOpen(
  section: { readonly id: string; readonly defaultOpen?: boolean },
  subjectHref: string,
  foldSectionKey: string | null,
  forceOpen: boolean,
): boolean {
  if (forceOpen) {
    return true;
  }
  const key = sectionKey(subjectHref, section.id);
  const closed = closedSectionKey(subjectHref, section.id);
  if (foldSectionKey === closed) {
    return false;
  }
  if (foldSectionKey === key) {
    return true;
  }
  return section.defaultOpen ?? true;
}

export function isNavSectionCollapsible(section: {
  readonly defaultOpen?: boolean;
  readonly collapsible?: boolean;
}): boolean {
  return section.collapsible ?? section.defaultOpen !== undefined;
}

export function locationForPath(
  groups: readonly NavGroup[],
  pathname: string,
  hash: string,
): NavLocation {
  const clusterId = hashIdFrom(hash);
  let hubSubjectHref: string | null = null;
  for (const group of groups) {
    if (group.hubTopic && pathname === group.href) {
      return {
        topicHref: group.href,
        subjectHref: null,
        clusterKey: null,
        sectionKey: null,
      };
    }
    if (
      group.leafTopic &&
      (pathname === group.href || pathname === group.leafTopic.href)
    ) {
      return {
        topicHref: group.leafTopic.href,
        subjectHref: null,
        clusterKey: null,
        sectionKey: null,
      };
    }
    for (const entry of group.entries) {
      switch (entry.kind) {
        case "topic":
          if (entry.topic.href === pathname) {
            return {
              topicHref: pathname,
              subjectHref: null,
              clusterKey: null,
              sectionKey: null,
            };
          }
          break;
        case "cluster":
          if (clusterId === entry.cluster.id) {
            const onSubject =
              pathname === entry.subjectHref ||
              pathname.startsWith(`${entry.subjectHref}/`);
            if (onSubject) {
              const onThisTopic = entry.cluster.topics.some(
                (topic) => topic.href === pathname,
              );
              const aliasTopic =
                !onThisTopic && pathname === entry.subjectHref
                  ? aliasTopicForCluster(entry.cluster)
                  : undefined;
              return {
                topicHref: onThisTopic ? pathname : (aliasTopic?.href ?? null),
                subjectHref: entry.subjectHref,
                clusterKey: clusterKey(entry.subjectHref, entry.cluster.id),
                sectionKey: null,
              };
            }
          }
          if (pathname === entry.subjectHref) {
            hubSubjectHref = entry.subjectHref;
          }
          if (entry.cluster.topics.some((topic) => topic.href === pathname)) {
            return {
              topicHref: pathname,
              subjectHref: entry.subjectHref,
              clusterKey: clusterKey(entry.subjectHref, entry.cluster.id),
              sectionKey: null,
            };
          }
          break;
        case "subject":
          if (entry.subject.href === pathname) {
            const cluster = navSubjectClusters(entry.subject).find(
              (item) => item.id === clusterId,
            );
            const aliasTopic = cluster
              ? aliasTopicForCluster(cluster)
              : undefined;
            const parentSection = cluster
              ? collapsibleSectionForCluster(entry.subject, cluster.id)
              : undefined;
            if (cluster) {
              return {
                topicHref: aliasTopic?.href ?? null,
                subjectHref: entry.subject.href,
                clusterKey: clusterKey(entry.subject.href, cluster.id),
                sectionKey: parentSection
                  ? sectionKey(entry.subject.href, parentSection.id)
                  : null,
              };
            }
            const navSection = entry.subject.sections?.find(
              (section) =>
                isNavSectionCollapsible(section) && section.id === clusterId,
            );
            if (navSection) {
              return {
                topicHref: null,
                subjectHref: entry.subject.href,
                clusterKey: null,
                sectionKey: sectionKey(entry.subject.href, navSection.id),
              };
            }
            return {
              topicHref: null,
              subjectHref: entry.subject.href,
              clusterKey: null,
              sectionKey: null,
            };
          }
          for (const cluster of navSubjectClusters(entry.subject)) {
            if (cluster.topics.some((topic) => topic.href === pathname)) {
              const parentSection = collapsibleSectionForCluster(
                entry.subject,
                cluster.id,
              );
              return {
                topicHref: pathname,
                subjectHref: entry.subject.href,
                clusterKey: clusterKey(entry.subject.href, cluster.id),
                sectionKey: parentSection
                  ? sectionKey(entry.subject.href, parentSection.id)
                  : null,
              };
            }
          }
          break;
        default: {
          const _never: never = entry;
          return _never;
        }
      }
    }
  }
  if (hubSubjectHref) {
    return {
      topicHref: null,
      subjectHref: hubSubjectHref,
      clusterKey: null,
      sectionKey: null,
    };
  }
  return {
    topicHref: null,
    subjectHref: null,
    clusterKey: null,
    sectionKey: null,
  };
}

function collapsibleSectionForCluster(subject: NavSubject, clusterId: string) {
  return subject.sections?.find(
    (section) =>
      isNavSectionCollapsible(section) &&
      section.clusters.some((cluster) => cluster.id === clusterId),
  );
}

export function hrefInHandbook(
  groups: readonly NavGroup[],
  href: string,
): boolean {
  const { pathname } = splitHref(href);
  const { path } = stripLocalePrefix(pathname);
  if (path === "/" || path === INSTRUCTIONS_HREF) {
    return true;
  }
  for (const group of groups) {
    if (group.href === pathname || group.leafTopic?.href === pathname) {
      return true;
    }
    if (group.hubTopic && group.href === pathname) {
      return true;
    }
    for (const entry of group.entries) {
      switch (entry.kind) {
        case "topic":
          if (entry.topic.href === pathname) {
            return true;
          }
          break;
        case "subject":
          if (entry.subject.href === pathname) {
            return true;
          }
          if (
            navSubjectClusters(entry.subject).some((cluster) =>
              cluster.topics.some((topic) => topic.href === pathname),
            )
          ) {
            return true;
          }
          break;
        case "cluster":
          if (entry.subjectHref === pathname) {
            return true;
          }
          if (entry.cluster.topics.some((topic) => topic.href === pathname)) {
            return true;
          }
          break;
        default: {
          const _never: never = entry;
          return _never;
        }
      }
    }
  }
  return false;
}

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
        if (!cluster || shouldWrapClusterAtBoundary(cluster)) {
          const step = wrapToFirstClusterStep(chain);
          if (step) {
            return stepHref(step);
          }
        }
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

export function crumbsForPath(
  groups: readonly NavGroup[],
  pathname: string,
  hash: string,
  labels: { home: string; instructions: string },
): readonly Crumb[] {
  const hashId = hashIdFrom(hash);
  const locale = localeFromPathname(pathname);
  const { path } = stripLocalePrefix(pathname);
  const home: Crumb = { label: labels.home, href: homeHref(locale) };

  if (path === "/") {
    return [{ label: labels.home }];
  }
  if (path === INSTRUCTIONS_HREF) {
    return [home, { label: labels.instructions }];
  }

  for (const group of groups) {
    if (!isActiveTrack(pathname, group.href)) {
      continue;
    }

    if (
      group.leafTopic &&
      (pathname === group.href || pathname === group.leafTopic.href)
    ) {
      return withConcept(
        home,
        [{ label: group.title, href: group.href }],
        group.leafTopic,
        hashId,
      );
    }

    if (pathname === group.href) {
      if (group.hubTopic) {
        return withConcept(
          home,
          [{ label: group.title, href: group.href }],
          group.hubTopic,
          hashId,
        );
      }
      for (const entry of group.entries) {
        switch (entry.kind) {
          case "cluster":
            if (
              hashId === entry.cluster.id &&
              !isTopicAliasCluster(entry.cluster)
            ) {
              return [
                home,
                { label: group.title, href: group.href },
                { label: entry.cluster.title },
              ];
            }
            break;
          case "subject": {
            const cluster = hashId
              ? navSubjectClusters(entry.subject).find(
                  (item) => item.id === hashId,
                )
              : undefined;
            if (
              cluster &&
              pathname === entry.subject.href &&
              !isTopicAliasCluster(cluster)
            ) {
              return [
                home,
                { label: group.title, href: group.href },
                { label: entry.subject.title, href: entry.subject.href },
                { label: cluster.title },
              ];
            }
            break;
          }
          case "topic":
            break;
          default: {
            const _never: never = entry;
            return _never;
          }
        }
      }
      return [home, { label: group.title }];
    }

    let hubTitle: string | null = null;
    for (const entry of group.entries) {
      switch (entry.kind) {
        case "topic": {
          if (entry.topic.href !== pathname) {
            break;
          }
          return withConcept(
            home,
            [
              { label: group.title, href: group.href },
              { label: entry.topic.title, href: entry.topic.href },
            ],
            entry.topic,
            hashId,
          );
        }
        case "subject": {
          if (pathname === entry.subject.href) {
            const cluster = hashId
              ? navSubjectClusters(entry.subject).find(
                  (item) => item.id === hashId,
                )
              : undefined;
            if (cluster && !isTopicAliasCluster(cluster)) {
              return [
                home,
                { label: group.title, href: group.href },
                { label: entry.subject.title, href: entry.subject.href },
                { label: cluster.title },
              ];
            }
            return [
              home,
              { label: group.title, href: group.href },
              { label: entry.subject.title },
            ];
          }
          for (const cluster of navSubjectClusters(entry.subject)) {
            const topic = cluster.topics.find((item) => item.href === pathname);
            if (!topic) {
              continue;
            }
            return withConcept(
              home,
              [
                { label: group.title, href: group.href },
                { label: entry.subject.title, href: entry.subject.href },
                ...(isTopicAliasCluster(cluster)
                  ? []
                  : [{ label: cluster.title, href: cluster.href }]),
                { label: topic.title, href: topic.href },
              ],
              topic,
              hashId,
            );
          }
          break;
        }
        case "cluster": {
          if (pathname === entry.subjectHref) {
            if (
              hashId === entry.cluster.id &&
              !isTopicAliasCluster(entry.cluster)
            ) {
              return [
                home,
                { label: group.title, href: entry.subjectHref },
                { label: entry.cluster.title },
              ];
            }
            hubTitle = group.title;
            break;
          }
          const topic = entry.cluster.topics.find(
            (item) => item.href === pathname,
          );
          if (!topic) {
            break;
          }
          return withConcept(
            home,
            [
              { label: group.title, href: group.href },
              ...(isTopicAliasCluster(entry.cluster)
                ? []
                : [{ label: entry.cluster.title, href: entry.cluster.href }]),
              { label: topic.title, href: topic.href },
            ],
            topic,
            hashId,
          );
        }
        default: {
          const _never: never = entry;
          return _never;
        }
      }
    }
    if (hubTitle) {
      return [home, { label: hubTitle }];
    }
  }

  return [home];
}

function sameTitle(left: string, right: string): boolean {
  return left.trim().toLowerCase() === right.trim().toLowerCase();
}

function isTopicAliasCluster(cluster: NavCluster): boolean {
  return Boolean(aliasTopicForCluster(cluster));
}

function aliasTopicForCluster(cluster: NavCluster): NavTopic | undefined {
  const only = cluster.topics.length === 1 ? cluster.topics[0] : undefined;
  if (!only || !sameTitle(cluster.title, only.title)) {
    return undefined;
  }
  return only;
}

function withConcept(
  home: Crumb,
  trail: readonly Crumb[],
  topic: NavTopic,
  hashId: string,
): readonly Crumb[] {
  const concept = conceptById(topic.concepts, hashId);
  const crumbs = [home, ...trail];
  if (concept) {
    return [...crumbs, { label: concept.title }];
  }
  const last = crumbs[crumbs.length - 1];
  if (!last) {
    return crumbs;
  }
  return [...crumbs.slice(0, -1), { label: last.label }];
}

function conceptById(
  concepts: readonly NavConcept[],
  id: string,
): NavConcept | undefined {
  if (!id) {
    return undefined;
  }
  return concepts.find((concept) => concept.id === id);
}
