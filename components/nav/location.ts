import {
  INSTRUCTIONS_HREF,
  splitHref,
  type Crumb,
  type NavCluster,
  type NavConcept,
  type NavGroup,
  type NavSubject,
  type NavTopic,
} from "@/lib/nav";
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

export function isActiveHref(pathname: string, href: string): boolean {
  return pathname === href;
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
