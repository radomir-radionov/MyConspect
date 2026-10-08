import {
  isTypesHubSectionSlug,
  isTypesHubSlug,
  typesHubSectionGroup,
  TYPES_HUB_SLUG,
} from "@/lib/catalog/typesHub";
import {
  INSTRUCTIONS_HREF,
  type Crumb,
  type NavConcept,
  type NavCluster,
  type NavGroup,
  type NavSubject,
  type NavTopic,
} from "@/lib/nav";
import { navSubjectClusters } from "@/lib/nav/subjectClusters";
import { hashIdFrom } from "@/lib/nav/navUtils";
import {
  homeHref,
  localeFromPathname,
  stripLocalePrefix,
} from "@/lib/i18n/paths";
import { isActiveTrack } from "./active";
import { isTopicAliasCluster } from "./shared";

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
            const typesHub = findTypesHubTopic(entry.subject);
            const sectionTrail = typesHubSectionTrail(
              topic,
              typesHub,
              entry.subject,
              group,
              cluster,
            );
            if (sectionTrail) {
              return withConcept(home, sectionTrail, topic, hashId);
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

function findTypesHubTopic(subject: NavSubject): NavTopic | undefined {
  for (const cluster of navSubjectClusters(subject)) {
    const hub = cluster.topics.find((item) => item.slug === TYPES_HUB_SLUG);
    if (hub) {
      return hub;
    }
  }
  return undefined;
}

function typesHubSectionTrail(
  topic: NavTopic,
  typesHub: NavTopic | undefined,
  subject: NavSubject,
  group: NavGroup,
  cluster: NavCluster,
): readonly Crumb[] | undefined {
  if (!typesHub) {
    return undefined;
  }
  const base: Crumb[] = [
    { label: group.title, href: group.href },
    { label: subject.title, href: subject.href },
    ...(isTopicAliasCluster(cluster)
      ? []
      : [{ label: cluster.title, href: cluster.href }]),
    { label: typesHub.title, href: typesHub.href },
  ];
  if (topic.slug === TYPES_HUB_SLUG) {
    return base;
  }
  if (!isTypesHubSectionSlug(topic.slug)) {
    return undefined;
  }
  const section = typesHubSectionGroup(topic.slug);
  return section ? [...base, { label: section }] : base;
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
    const tail: Crumb[] = [];
    if (concept.group && concept.group !== concept.title) {
      tail.push({ label: concept.group });
    }
    tail.push({ label: concept.title });
    return [...crumbs, ...tail];
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
