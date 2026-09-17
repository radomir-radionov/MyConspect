import {
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
import { loadTopicOutline } from "@/lib/parse";
import type { NavEntry, NavGroup, NavTopic } from "./types";

function sameTitle(left: string, right: string): boolean {
  return left.trim().toLowerCase() === right.trim().toLowerCase();
}

function toNavTopic(topic: Topic): NavTopic {
  return {
    slug: topic.slug,
    href: topicHref(topic),
    title: topic.title,
    blurb: topic.blurb,
    concepts: loadTopicOutline(topic),
  };
}

function entriesForTrack(trackId: (typeof TRACKS)[number]["id"]): readonly NavEntry[] {
  const seenSubjects = new Set<string>();
  const entries: NavEntry[] = [];

  for (const topic of topicsForTrack(trackId)) {
    if (topic.grouping) {
      if (seenSubjects.has(topic.grouping.subject)) {
        continue;
      }
      seenSubjects.add(topic.grouping.subject);
      const subject = SUBJECTS.find(
        (item) => item.track === trackId && item.slug === topic.grouping?.subject,
      );
      if (!subject) {
        continue;
      }
      const clusters = subject.clusters
        .map((cluster) => ({
          id: cluster.id,
          title: cluster.title,
          href: clusterHref(subject, cluster),
          topics: topicsForCluster(subject, cluster.id).map(toNavTopic),
        }))
        .filter((cluster) => cluster.topics.length > 0);
      if (clusters.length === 0) {
        continue;
      }
      entries.push({
        kind: "subject",
        subject: {
          slug: subject.slug,
          href: subjectHref(subject),
          title: subject.title,
          blurb: subject.blurb,
          clusters,
        },
      });
      continue;
    }

    entries.push({ kind: "topic", topic: toNavTopic(topic) });
  }

  return entries;
}

export function handbookNav(): readonly NavGroup[] {
  return TRACKS.map((track) => {
    const href = trackHref(track.id);
    const leaf = leafTopicForTrack(track.id);
    if (leaf && sameTitle(leaf.title, track.title)) {
      return {
        id: track.id,
        title: track.title,
        href,
        entries: [],
        leafTopic: toNavTopic(leaf),
      };
    }

    const entries = entriesForTrack(track.id);
    const only = entries.length === 1 ? entries[0] : undefined;
    if (only?.kind === "subject" && sameTitle(only.subject.title, track.title)) {
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
