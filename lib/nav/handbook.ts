import { TRACKS, topicHref, topicsForTrack, trackHref } from "@/lib/catalog";
import { loadTopicOutline } from "@/lib/parse";
import type { NavGroup } from "./types";

export function handbookNav(): readonly NavGroup[] {
  return TRACKS.map((track) => ({
    id: track.id,
    title: track.title,
    href: trackHref(track.id),
    topics: topicsForTrack(track.id).map((topic) => ({
      slug: topic.slug,
      href: topicHref(topic),
      title: topic.title,
      blurb: topic.blurb,
      concepts: loadTopicOutline(topic),
    })),
  }));
}
