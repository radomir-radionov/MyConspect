import {
  clusterHref,
  getCluster,
  getSubject,
  getTrack,
  subjectHref,
  trackHref,
  type Subject,
  type Topic,
  type Track,
} from "@/lib/catalog";
import { CHROME } from "./chrome";
import type { Crumb, HashCrumb } from "./types";

function homeCrumb(): Crumb {
  return { label: CHROME.home, href: "/" };
}

export function trackCrumbs(track: Track): readonly Crumb[] {
  return [homeCrumb(), { label: track.title }];
}

export function subjectCrumbs(subject: Subject): readonly Crumb[] {
  const trail: Crumb[] = [homeCrumb()];
  const track = getTrack(subject.track);
  if (track && subjectHref(subject) !== trackHref(track.id)) {
    trail.push({ label: track.title, href: trackHref(track.id) });
  }
  trail.push({ label: subject.title });
  return trail;
}

export function topicCrumbs(topic: Topic): readonly Crumb[] {
  const trail: Crumb[] = [homeCrumb()];
  const track = getTrack(topic.track);
  const subject = topic.grouping
    ? getSubject(topic.track, topic.grouping.subject)
    : undefined;
  const subjectPath = subject ? subjectHref(subject) : undefined;

  if (track && subjectPath !== trackHref(track.id)) {
    trail.push({ label: track.title, href: trackHref(track.id) });
  }

  if (subject && subjectPath) {
    trail.push({ label: subject.title, href: subjectPath });
    const cluster = topic.grouping
      ? getCluster(subject, topic.grouping.cluster)
      : undefined;
    if (cluster) {
      trail.push({ label: cluster.title, href: clusterHref(subject, cluster) });
    }
  }

  trail.push({ label: topic.title });
  return trail;
}

export function crumbsWithActive(
  items: readonly Crumb[],
  pageHref: string,
  hashCrumbs: readonly HashCrumb[],
  activeId: string,
): readonly Crumb[] {
  if (!activeId || items.length === 0) {
    return items;
  }
  const match = hashCrumbs.find((item) => item.id === activeId);
  if (!match) {
    return items;
  }
  const last = items[items.length - 1];
  if (!last || last.label === match.label) {
    return items;
  }
  return [
    ...items.slice(0, -1),
    { label: last.label, href: last.href ?? pageHref },
    { label: match.label },
  ];
}
