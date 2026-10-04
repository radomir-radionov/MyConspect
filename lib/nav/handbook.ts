import {
  SUBJECTS,
  TRACKS,
  clusterTargetHref,
  getSubject,
  hubFileForTrack,
  leafTopicForTrack,
  subjectHref,
  subjectClusterNavPlacement,
  topicHref,
  topicsForCluster,
  topicsForTrack,
  trackHref,
  type Topic,
  type TrackId,
} from "@/lib/catalog";
import { catalogBlurb } from "@/lib/i18n/catalog";
import {
  behaviorPageTitle,
  isBehaviorQuestionsTopic,
  localizeBehaviorOutline,
} from "@/lib/i18n/behaviorQuestions";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/locales";
import { withLocale } from "@/lib/i18n/paths";
import {
  loadFileOutline,
  loadTopicOutline,
  type ConceptOutline,
} from "@/lib/parse";
import {
  filterInterviewConcepts,
  isQuestionCluster,
  sameTitle,
  shouldHideSidebarConcepts,
} from "./navUtils";
import type {
  NavCluster,
  NavEntry,
  NavGroup,
  NavSubject,
  NavTopic,
} from "./types";

function localizeHref(locale: Locale, href: string): string {
  return withLocale(locale, href);
}

function hubNavTopic(
  trackId: (typeof TRACKS)[number]["id"],
  locale: Locale,
): NavTopic | undefined {
  const file = hubFileForTrack(trackId);
  if (!file) {
    return undefined;
  }
  const concepts = loadFileOutline(file, locale);
  if (concepts.length === 0) {
    return undefined;
  }
  return {
    slug: "hub",
    href: localizeHref(locale, trackHref(trackId)),
    title: "",
    blurb: "",
    concepts,
  };
}

function toNavTopic(topic: Topic, locale: Locale): NavTopic {
  const outline = filterInterviewConcepts(
    topic,
    loadTopicOutline(topic, locale),
  );
  return {
    slug: topic.slug,
    href: localizeHref(locale, topicHref(topic)),
    title: catalogBlurb(locale, topic.title),
    blurb: catalogBlurb(locale, topic.blurb),
    concepts: isBehaviorQuestionsTopic(topic)
      ? localizeBehaviorOutline(outline, locale)
      : outline,
    hideSidebarConcepts: shouldHideSidebarConcepts(topic),
  };
}

function entriesForTrack(
  trackId: (typeof TRACKS)[number]["id"],
  locale: Locale,
): readonly NavEntry[] {
  const seenSubjects = new Set<string>();
  const entries: NavEntry[] = [];

  for (const topic of topicsForTrack(trackId)) {
    if (topic.grouping) {
      if (seenSubjects.has(topic.grouping.subject)) {
        continue;
      }
      seenSubjects.add(topic.grouping.subject);
      const subject = SUBJECTS.find(
        (item) =>
          item.track === trackId && item.slug === topic.grouping?.subject,
      );
      if (!subject) {
        continue;
      }
      const clusters = subject.clusters
        .map((cluster) => ({
          id: cluster.id,
          title: cluster.title,
          href: localizeHref(locale, clusterTargetHref(subject, cluster)),
          topics: topicsForCluster(subject, cluster.id).map((item) =>
            toNavTopic(item, locale),
          ),
        }))
        .filter((cluster) => cluster.topics.length > 0);
      if (clusters.length === 0) {
        continue;
      }
      const sections = subject.sections?.map((section) => ({
        id: section.id,
        title: section.title,
        defaultOpen: section.defaultOpen,
        collapsible: section.collapsible,
        flatNav: section.flatNav,
        clusters: clusters.filter((cluster) => {
          const definition = subject.clusters.find(
            (item) => item.id === cluster.id,
          );
          return definition
            ? subjectClusterNavPlacement(definition) === "section" &&
                definition.section === section.id
            : false;
        }),
      }));
      const rootClusters = clusters.filter((cluster) => {
        const definition = subject.clusters.find(
          (item) => item.id === cluster.id,
        );
        return definition
          ? subjectClusterNavPlacement(definition) === "root"
          : false;
      });
      const clustersAfterSections = clusters.filter((cluster) => {
        const definition = subject.clusters.find(
          (item) => item.id === cluster.id,
        );
        return definition
          ? subjectClusterNavPlacement(definition) === "after-sections"
          : false;
      });
      entries.push({
        kind: "subject",
        subject: {
          slug: subject.slug,
          href: localizeHref(locale, subjectHref(subject)),
          title: subject.title,
          blurb: catalogBlurb(locale, subject.blurb),
          sections: sections?.length ? sections : undefined,
          clusters: sections?.length ? rootClusters : clusters,
          clustersAfterSections: sections?.length
            ? clustersAfterSections
            : undefined,
        },
      });
      continue;
    }

    entries.push({ kind: "topic", topic: toNavTopic(topic, locale) });
  }

  return entries;
}

function isGenericQuestionTitle(title: string): boolean {
  return title === "Interview" || title === "Tasks";
}

function hoistedTopicTitle(
  trackId: TrackId,
  subject: NavSubject,
  cluster: NavCluster,
  topic: NavTopic,
  locale: Locale,
): string {
  if (!isGenericQuestionTitle(topic.title)) {
    return topic.title;
  }
  const catalogSubject = getSubject(trackId, subject.slug);
  const definition = catalogSubject?.clusters.find(
    (item) => item.id === cluster.id,
  );
  const section = catalogSubject?.sections?.find(
    (item) => item.id === definition?.section,
  );
  if (section) {
    return catalogBlurb(locale, section.title);
  }
  return subject.title;
}

function takeQuestionClusters(
  trackId: TrackId,
  subject: NavSubject,
  locale: Locale,
): {
  readonly subject: NavSubject;
  readonly interview: readonly NavTopic[];
  readonly tasks: readonly NavTopic[];
} {
  const interview: NavTopic[] = [];
  const tasks: NavTopic[] = [];

  const split = (clusters: readonly NavCluster[]): NavCluster[] => {
    const kept: NavCluster[] = [];
    for (const cluster of clusters) {
      if (!isQuestionCluster(cluster.id)) {
        kept.push(cluster);
        continue;
      }
      const topics = cluster.topics.map((topic) => ({
        ...topic,
        title: hoistedTopicTitle(trackId, subject, cluster, topic, locale),
      }));
      if (cluster.id === "tasks" || cluster.id.endsWith("-tasks")) {
        tasks.push(...topics);
      } else {
        interview.push(...topics);
      }
    }
    return kept;
  };

  const root = split(subject.clusters);
  const sections = subject.sections
    ?.map((section) => ({ ...section, clusters: split(section.clusters) }))
    .filter((section) => section.clusters.length > 0);
  const after = subject.clustersAfterSections
    ? split(subject.clustersAfterSections)
    : undefined;

  return {
    subject: {
      ...subject,
      clusters: root,
      sections: sections?.length ? sections : undefined,
      clustersAfterSections: after?.length ? after : undefined,
    },
    interview,
    tasks,
  };
}

function questionClusterEntry(
  trackHref: string,
  id: string,
  title: string,
  topics: readonly NavTopic[],
): NavEntry | null {
  if (topics.length === 0) {
    return null;
  }
  return {
    kind: "cluster",
    subjectHref: trackHref,
    cluster: {
      id,
      title,
      href: topics.length === 1 ? topics[0].href : trackHref,
      topics,
    },
  };
}

function hoistQuestionClusters(
  entries: readonly NavEntry[],
  trackId: TrackId,
  locale: Locale,
  localizedTrackHref: string,
): readonly NavEntry[] {
  const interview: NavTopic[] = [];
  const tasks: NavTopic[] = [];
  const next: NavEntry[] = [];

  for (const entry of entries) {
    if (entry.kind !== "subject") {
      next.push(entry);
      continue;
    }
    const pulled = takeQuestionClusters(trackId, entry.subject, locale);
    interview.push(...pulled.interview);
    tasks.push(...pulled.tasks);
    next.push({ kind: "subject", subject: pulled.subject });
  }

  const interviewEntry = questionClusterEntry(
    localizedTrackHref,
    "interview",
    catalogBlurb(locale, "Interview"),
    interview,
  );
  const tasksEntry = questionClusterEntry(
    localizedTrackHref,
    "tasks",
    catalogBlurb(locale, "Tasks"),
    tasks,
  );
  if (interviewEntry) {
    next.push(interviewEntry);
  }
  if (tasksEntry) {
    next.push(tasksEntry);
  }
  return next;
}

export function handbookNav(
  locale: Locale = DEFAULT_LOCALE,
): readonly NavGroup[] {
  return TRACKS.map((track) => {
    const href = localizeHref(locale, trackHref(track.id));
    const leaf = leafTopicForTrack(track.id);
    if (leaf && sameTitle(leaf.title, track.title)) {
      return {
        id: track.id,
        title: catalogBlurb(locale, track.title),
        href,
        entries: [],
        leafTopic: toNavTopic(leaf, locale),
      };
    }

    const entries = entriesForTrack(track.id, locale);
    const only = entries.length === 1 ? entries[0] : undefined;
    if (
      only?.kind === "subject" &&
      sameTitle(only.subject.title, track.title)
    ) {
      return {
        id: track.id,
        title: catalogBlurb(locale, track.title),
        href,
        hubTopic: hubNavTopic(track.id, locale),
        entries: only.subject.clusters.map((cluster) => ({
          kind: "cluster" as const,
          subjectHref: only.subject.href,
          cluster,
        })),
      };
    }

    return {
      id: track.id,
      title: catalogBlurb(locale, track.title),
      href,
      entries: hoistQuestionClusters(entries, track.id, locale, href),
    };
  });
}
