import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClusterCardSections } from "@/components/catalog";
import { ConceptList, PageTitleHeader } from "@/components/topic";
import {
  getSubject,
  getTrack,
  isInterviewTasksTopic,
  isInterviewTopic,
  subjectClusterCards,
  subjectRootClusterCards,
  subjectSectionClusterCards,
  topicRouteParams,
  type Topic,
} from "@/lib/catalog";
import { catalogBlurb } from "@/lib/i18n/catalog";
import { FALLBACK_NOTE_BADGE } from "@/lib/i18n/chrome";
import { isLocale, localeStaticParams, type Locale } from "@/lib/i18n/locales";
import { withLocale } from "@/lib/i18n/paths";
import { loadTopicPage, type Concept } from "@/lib/parse";

function conceptsForInterviewTopic(
  topic: Topic,
  concepts: readonly Concept[],
): readonly Concept[] {
  if (isInterviewTasksTopic(topic)) {
    return concepts.filter((concept) => concept.interviewSection === "tasks");
  }
  if (isInterviewTopic(topic)) {
    return concepts.filter((concept) => concept.interviewSection !== "tasks");
  }
  return concepts;
}

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

function localizeGroupedClusterSections(
  locale: Locale,
  sections: ReturnType<typeof subjectSectionClusterCards>,
) {
  return sections.map((section) => ({
    section: section.section,
    clusters: section.clusters.map((entry) => ({
      cluster: {
        ...entry.cluster,
        blurb: catalogBlurb(locale, entry.cluster.blurb),
      },
      items: localizeCards(locale, entry.items),
    })),
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
    const groupedSections = subject.sections?.length
      ? localizeGroupedClusterSections(
          locale,
          subjectSectionClusterCards(subject),
        )
      : undefined;
    const rootSections = subject.sections?.length
      ? localizeClusterSections(locale, subjectRootClusterCards(subject))
      : undefined;
    const sections =
      groupedSections || rootSections
        ? undefined
        : localizeClusterSections(locale, subjectClusterCards(subject));
    return (
      <main className="w-full max-w-5xl px-4 pt-5 pb-10 sm:px-6">
        <PageTitleHeader title={subject.title} />
        <ClusterCardSections
          sections={sections}
          rootSections={rootSections}
          groupedSections={groupedSections}
        />
      </main>
    );
  }

  const loaded = await loadTopicPage(trackId, slug, locale);
  if (!loaded || !track) {
    notFound();
  }

  const pageConcepts = conceptsForInterviewTopic(
    loaded.topic,
    loaded.parsed.concepts,
  );
  const pageTitle = isInterviewTasksTopic(loaded.topic)
    ? loaded.topic.title
    : loaded.parsed.title;

  return (
    <main className="w-full max-w-3xl px-4 pt-5 pb-10 sm:px-6">
      {loaded.usedFallback ? (
        <p className="mb-4 text-sm text-amber-700 dark:text-amber-300">
          {FALLBACK_NOTE_BADGE[locale]}
        </p>
      ) : null}
      <ConceptList
        concepts={pageConcepts}
        topicTitle={pageTitle}
        emptyMessage="No concepts were parsed from this topic."
        groupInterviewSections={
          isInterviewTopic(loaded.topic) && !isInterviewTasksTopic(loaded.topic)
        }
      />
    </main>
  );
}
