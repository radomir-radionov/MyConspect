import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClusterCardSections } from "@/components/catalog";
import { ConceptList } from "@/components/topic";
import {
  getSubject,
  getTrack,
  isInterviewTopic,
  subjectClusterCards,
  topicRouteParams,
} from "@/lib/catalog";
import { catalogBlurb } from "@/lib/i18n/catalog";
import { FALLBACK_NOTE_BADGE } from "@/lib/i18n/chrome";
import { isLocale, localeStaticParams, type Locale } from "@/lib/i18n/locales";
import { withLocale } from "@/lib/i18n/paths";
import { loadTopicPage } from "@/lib/parse";

export const dynamicParams = false;

export function generateStaticParams() {
  return localeStaticParams().flatMap(({ locale }) =>
    topicRouteParams().map((param) => ({
      locale,
      track: param.track,
      topic: param.topic,
    })),
  );
}

function localizeCards(
  locale: Locale,
  items: readonly { href: string; title: string; description: string }[],
) {
  return items.map((item) => ({
    ...item,
    href: withLocale(locale, item.href),
    description: catalogBlurb(locale, item.description),
  }));
}

function localizeClusterSections(
  locale: Locale,
  sections: ReturnType<typeof subjectClusterCards>,
) {
  return sections.map((section) => ({
    cluster: {
      ...section.cluster,
      blurb: catalogBlurb(locale, section.cluster.blurb),
    },
    items: localizeCards(locale, section.items),
  }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/[track]/[topic]">): Promise<Metadata> {
  const { locale: localeParam, track, topic: slug } = await params;
  if (!isLocale(localeParam)) {
    return { title: "Not found" };
  }
  const locale = localeParam;
  const path = withLocale(locale, `/${track}/${slug}`);
  const alternates = {
    canonical: path,
    languages: {
      en: withLocale("en", `/${track}/${slug}`),
      ru: withLocale("ru", `/${track}/${slug}`),
    },
  };
  const subject = getSubject(track, slug);
  if (subject) {
    return {
      title: subject.title,
      description: catalogBlurb(locale, subject.blurb),
      alternates,
    };
  }
  const loaded = await loadTopicPage(track, slug, locale);
  if (!loaded) {
    return { title: "Not found" };
  }
  return {
    title: loaded.parsed.title,
    description: loaded.parsed.description,
    alternates,
  };
}

export default async function TopicPage({
  params,
}: PageProps<"/[locale]/[track]/[topic]">) {
  const { locale: localeParam, track: trackId, topic: slug } = await params;
  if (!isLocale(localeParam)) {
    notFound();
  }
  const locale = localeParam;
  const track = getTrack(trackId);
  const subject = getSubject(trackId, slug);
  if (subject && track) {
    const sections = localizeClusterSections(locale, subjectClusterCards(subject));
    return (
      <main className="w-full max-w-5xl px-4 pt-5 pb-10 sm:px-6">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {subject.title}
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
          {catalogBlurb(locale, subject.blurb)}
        </p>
        <ClusterCardSections sections={sections} />
      </main>
    );
  }

  const loaded = await loadTopicPage(trackId, slug, locale);
  if (!loaded || !track) {
    notFound();
  }

  return (
    <main className="w-full max-w-3xl px-4 pt-5 pb-10 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {loaded.parsed.title}
      </h1>
      {loaded.usedFallback ? (
        <p className="mt-2 text-sm text-amber-700 dark:text-amber-300">
          {FALLBACK_NOTE_BADGE[locale]}
        </p>
      ) : null}
      <div className="mt-8">
        <ConceptList
          concepts={loaded.parsed.concepts}
          emptyMessage="No concepts were parsed from this topic."
          groupInterviewSections={isInterviewTopic(loaded.topic)}
        />
      </div>
    </main>
  );
}
