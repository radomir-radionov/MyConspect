import type { MetadataRoute } from "next";
import { SUBJECTS, TRACKS, TOPICS, isLeafTopic, subjectHref, topicHref } from "@/lib/catalog";
import { INSTRUCTIONS_HREF } from "@/lib/nav";
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

  const trackUrls = new Set(tracks.map((item) => item.url));
  const subjects = SUBJECTS.map((subject) => ({
    url: `${base}${subjectHref(subject)}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  })).filter((item) => !trackUrls.has(item.url));

  const topics = TOPICS.filter((topic) => !isLeafTopic(topic)).map((topic) => ({
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

  return [home, instructions, ...tracks, ...subjects, ...topics];
}
