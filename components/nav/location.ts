import {
  INSTRUCTIONS_HREF,
  splitHref,
  type Crumb,
  type NavCluster,
  type NavConcept,
  type NavGroup,
  type NavTopic,
} from "@/lib/nav";
import { hashIdFrom } from "./hash";

export type NavLocation = {
  topicHref: string | null;
  subjectHref: string | null;
  clusterKey: string | null;
};

export function isActiveHref(pathname: string, href: string): boolean {
  return pathname === href;
}

export function isActiveTrack(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function clusterKey(subjectHref: string, clusterId: string) {
  return `${subjectHref}#${clusterId}`;
}

export function locationForPath(
  groups: readonly NavGroup[],
  pathname: string,
  hash: string,
): NavLocation {
  const clusterId = hashIdFrom(hash);
  let hubSubjectHref: string | null = null;
  for (const group of groups) {
    if (group.leafTopic && (pathname === group.href || pathname === group.leafTopic.href)) {
      return {
        topicHref: group.leafTopic.href,
        subjectHref: null,
        clusterKey: null,
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
            };
          }
          break;
        case "cluster":
          if (clusterId === entry.cluster.id) {
            const onSubject =
              pathname === entry.subjectHref ||
              pathname.startsWith(`${entry.subjectHref}/`);
            if (onSubject) {
              const onThisTopic = entry.cluster.topics.some((topic) => topic.href === pathname);
              return {
                topicHref: onThisTopic ? pathname : null,
                subjectHref: entry.subjectHref,
                clusterKey: clusterKey(entry.subjectHref, entry.cluster.id),
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
            };
          }
          break;
        case "subject":
          if (entry.subject.href === pathname) {
            const cluster = entry.subject.clusters.find((item) => item.id === clusterId);
            return {
              topicHref: null,
              subjectHref: entry.subject.href,
              clusterKey: cluster ? clusterKey(entry.subject.href, cluster.id) : null,
            };
          }
          for (const cluster of entry.subject.clusters) {
            if (cluster.topics.some((topic) => topic.href === pathname)) {
              return {
                topicHref: pathname,
                subjectHref: entry.subject.href,
                clusterKey: clusterKey(entry.subject.href, cluster.id),
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
    };
  }
  return { topicHref: null, subjectHref: null, clusterKey: null };
}

export function hrefInHandbook(groups: readonly NavGroup[], href: string): boolean {
  const { pathname } = splitHref(href);
  if (pathname === "/" || pathname === INSTRUCTIONS_HREF) {
    return true;
  }
  for (const group of groups) {
    if (group.href === pathname || group.leafTopic?.href === pathname) {
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
            entry.subject.clusters.some((cluster) =>
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
  const home: Crumb = { label: labels.home, href: "/" };

  if (pathname === "/") {
    return [{ label: labels.home }];
  }
  if (pathname === INSTRUCTIONS_HREF) {
    return [home, { label: labels.instructions }];
  }

  for (const group of groups) {
    if (!isActiveTrack(pathname, group.href)) {
      continue;
    }

    if (group.leafTopic && (pathname === group.href || pathname === group.leafTopic.href)) {
      return withConcept(home, [{ label: group.title, href: group.href }], group.leafTopic, hashId);
    }

    if (pathname === group.href) {
      for (const entry of group.entries) {
        switch (entry.kind) {
          case "cluster":
            if (hashId === entry.cluster.id && !isTopicAliasCluster(entry.cluster)) {
              return [
                home,
                { label: group.title, href: group.href },
                { label: entry.cluster.title },
              ];
            }
            break;
          case "subject": {
            const cluster = hashId
              ? entry.subject.clusters.find((item) => item.id === hashId)
              : undefined;
            if (cluster && pathname === entry.subject.href && !isTopicAliasCluster(cluster)) {
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
              ? entry.subject.clusters.find((item) => item.id === hashId)
              : undefined;
            if (cluster && !isTopicAliasCluster(cluster)) {
              return [
                home,
                { label: group.title, href: group.href },
                { label: entry.subject.title, href: entry.subject.href },
                { label: cluster.title },
              ];
            }
            return [home, { label: group.title, href: group.href }, { label: entry.subject.title }];
          }
          for (const cluster of entry.subject.clusters) {
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
            if (hashId === entry.cluster.id && !isTopicAliasCluster(entry.cluster)) {
              return [
                home,
                { label: group.title, href: entry.subjectHref },
                { label: entry.cluster.title },
              ];
            }
            hubTitle = group.title;
            break;
          }
          const topic = entry.cluster.topics.find((item) => item.href === pathname);
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
  const only = cluster.topics.length === 1 ? cluster.topics[0] : undefined;
  return Boolean(only && sameTitle(cluster.title, only.title));
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

function conceptById(concepts: readonly NavConcept[], id: string): NavConcept | undefined {
  if (!id) {
    return undefined;
  }
  return concepts.find((concept) => concept.id === id);
}
