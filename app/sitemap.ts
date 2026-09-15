import type { MetadataRoute } from "next";
import { TRACKS, TOPICS, topicHref } from "@/lib/content/catalog";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const now = new Date();

  const home: MetadataRoute.Sitemap[number] = {
    url: base,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 1,
  };

  const tracks = TRACKS.map((track) => ({
    url: `${base}/${track.id}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const topics = TOPICS.map((topic) => ({
    url: `${base}${topicHref(topic)}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [home, ...tracks, ...topics];
}
