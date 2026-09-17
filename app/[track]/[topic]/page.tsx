import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BackLink, ClusterCardSections } from "@/components/catalog";
import { ConceptList } from "@/components/topic";
import {
  getSubject,
  getTrack,
  isInterviewTopic,
  subjectClusterCards,
  topicRouteParams,
} from "@/lib/catalog";
import { backToLabel } from "@/lib/nav";
import { loadTopicPage } from "@/lib/parse";

export const dynamicParams = false;

export function generateStaticParams() {
  return topicRouteParams().map((param) => ({
    track: param.track,
    topic: param.topic,
  }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[track]/[topic]">): Promise<Metadata> {
  const { track, topic: slug } = await params;
  const subject = getSubject(track, slug);
  if (subject) {
    return {
      title: subject.title,
      description: subject.blurb,
    };
  }
  const loaded = await loadTopicPage(track, slug);
  if (!loaded) {
    return { title: "Not found" };
  }
  return {
    title: loaded.parsed.title,
    description: loaded.parsed.description,
  };
}

export default async function TopicPage({ params }: PageProps<"/[track]/[topic]">) {
  const { track: trackId, topic: slug } = await params;
  const track = getTrack(trackId);
  const subject = getSubject(trackId, slug);
  if (subject && track) {
    return (
      <main className="w-full max-w-5xl px-4 py-10 sm:px-6">
        <BackLink href={`/${track.id}`} label={backToLabel(track.title)} />
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">{subject.title}</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">{subject.blurb}</p>
        <ClusterCardSections sections={subjectClusterCards(subject)} />
      </main>
    );
  }

  const loaded = await loadTopicPage(trackId, slug);
  if (!loaded || !track) {
    notFound();
  }

  return (
    <main className="w-full max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
        {loaded.parsed.title}
      </h1>
      <p className="mt-3 text-base leading-7 text-zinc-600">{loaded.parsed.description}</p>
      <p className="mt-2 text-sm text-zinc-500">
        {loaded.parsed.concepts.length} concepts · click a title to expand
      </p>
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
