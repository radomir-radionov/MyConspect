import type { MetadataRoute } from "next";
import { TRACKS, TOPICS, topicHref } from "@/lib/content/catalog";
import { INSTRUCTIONS_HREF } from "@/lib/content/nav";
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

  const instructions: MetadataRoute.Sitemap[number] = {
    url: `${base}${INSTRUCTIONS_HREF}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.4,
  };

  return [home, instructions, ...tracks, ...topics];
}
