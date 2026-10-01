import {
  isInterviewTasksTopic,
  isInterviewTopic,
  SUBJECTS,
  TRACKS,
  clusterHref,
  leafTopicForTrack,
  subjectHref,
  topicHref,
  topicsForCluster,
  topicsForTrack,
  trackHref,
  type Topic,
} from "@/lib/catalog";
import { catalogBlurb } from "@/lib/i18n/catalog";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/locales";
import { withLocale } from "@/lib/i18n/paths";
import { loadTopicOutline } from "@/lib/parse";
import type { ConceptOutline } from "@/lib/parse";
import type { NavEntry, NavGroup, NavTopic } from "./types";

function sameTitle(left: string, right: string): boolean {
  return left.trim().toLowerCase() === right.trim().toLowerCase();
}

function localizeHref(locale: Locale, href: string): string {
  return withLocale(locale, href);
}

function outlineForTopic(
  topic: Topic,
  outline: readonly ConceptOutline[],
): readonly ConceptOutline[] {
  if (isInterviewTasksTopic(topic)) {
    return outline.filter((concept) => concept.interviewSection === "tasks");
  }
  if (isInterviewTopic(topic)) {
    return outline.filter((concept) => concept.interviewSection !== "tasks");
  }
  return outline;
}

function toNavTopic(topic: Topic, locale: Locale): NavTopic {
  const outline = outlineForTopic(topic, loadTopicOutline(topic, locale));
  return {
    slug: topic.slug,
    href: localizeHref(locale, topicHref(topic)),
    title: topic.title,
    blurb: catalogBlurb(locale, topic.blurb),
    concepts: outline,
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
          href: localizeHref(locale, clusterHref(subject, cluster)),
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
        clusters: clusters.filter((cluster) => {
          const definition = subject.clusters.find(
            (item) => item.id === cluster.id,
          );
          return definition?.section === section.id;
        }),
      }));
      const rootClusters = clusters.filter((cluster) => {
        const definition = subject.clusters.find(
          (item) => item.id === cluster.id,
        );
        return !definition?.section;
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
        },
      });
      continue;
    }

    entries.push({ kind: "topic", topic: toNavTopic(topic, locale) });
  }

  return entries;
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
        title: track.title,
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
        title: track.title,
        href,
        entries: only.subject.clusters.map((cluster) => ({
          kind: "cluster" as const,
          subjectHref: only.subject.href,
          cluster,
        })),
      };
    }

    return {
      id: track.id,
      title: track.title,
      href,
      entries,
    };
  });
}
