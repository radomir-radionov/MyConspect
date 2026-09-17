import { INSTRUCTIONS_HREF, splitHref, type NavGroup } from "@/lib/nav";
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
