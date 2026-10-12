import type { MetadataRoute } from "next";
import { SUBJECTS, TRACKS, TOPICS, isLeafTopic, subjectHref, topicHref } from "@/lib/catalog";
import { LOCALES } from "@/lib/i18n/locales";
import { instructionsHref, withLocale } from "@/lib/i18n/paths";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    entries.push({
      url: `${base}/${locale}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: Object.fromEntries(LOCALES.map((item) => [item, `${base}/${item}`])),
      },
    });

    entries.push({
      url: `${base}${instructionsHref(locale)}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((item) => [item, `${base}${instructionsHref(item)}`]),
        ),
      },
    });

    for (const track of TRACKS) {
      const path = withLocale(locale, `/${track.id}`);
      entries.push({
        url: `${base}${path}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.8,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map((item) => [item, `${base}${withLocale(item, `/${track.id}`)}`]),
          ),
        },
      });
    }

    const trackPaths = new Set(TRACKS.map((track) => `/${track.id}`));
    for (const subject of SUBJECTS) {
      const raw = subjectHref(subject);
      if (trackPaths.has(raw)) {
        continue;
      }
      entries.push({
        url: `${base}${withLocale(locale, raw)}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map((item) => [item, `${base}${withLocale(item, raw)}`]),
          ),
        },
      });
    }

    for (const topic of TOPICS.filter((item) => !isLeafTopic(item))) {
      const raw = topicHref(topic);
      entries.push({
        url: `${base}${withLocale(locale, raw)}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.6,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map((item) => [item, `${base}${withLocale(item, raw)}`]),
          ),
        },
      });
    }
  }

  return entries;
}
