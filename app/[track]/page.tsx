import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs, CardGrid, ClusterCardSections } from "@/components/catalog";
import { ConceptList } from "@/components/topic";
import {
  TRACKS,
  getTrack,
  isInterviewTopic,
  isTrackId,
  leafTopicForTrack,
  subjectClusterCards,
  subjectForTrack,
  subjectHref,
  trackBrowseCards,
  trackHref,
  topicHref,
} from "@/lib/catalog";
import { subjectCrumbs, trackCrumbs } from "@/lib/nav";
import { loadParsedTopic } from "@/lib/parse";

export const dynamicParams = false;

export function generateStaticParams() {
  return TRACKS.map((track) => ({ track: track.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[track]">): Promise<Metadata> {
  const { track: trackId } = await params;
  const track = getTrack(trackId);
  if (!track) {
    return { title: "Not found" };
  }
  const subject = isTrackId(trackId) ? subjectForTrack(trackId) : undefined;
  if (subject) {
    return {
      title: subject.title,
      description: subject.blurb,
    };
  }
  if (isTrackId(trackId)) {
    const leaf = leafTopicForTrack(trackId);
    if (leaf) {
      const parsed = await loadParsedTopic(leaf);
      return {
        title: parsed.title,
        description: parsed.description,
      };
    }
  }
  return {
    title: track.title,
    description: track.description,
  };
}

export default async function TrackPage({ params }: PageProps<"/[track]">) {
  const { track: trackId } = await params;
  if (!isTrackId(trackId)) {
    notFound();
  }
  const track = getTrack(trackId);
  if (!track) {
    notFound();
  }

  const subject = subjectForTrack(track.id);
  if (subject) {
    return (
      <main className="w-full max-w-5xl px-4 py-10 sm:px-6">
        <Breadcrumbs
          items={subjectCrumbs(subject)}
          pageHref={subjectHref(subject)}
          hashCrumbs={subject.clusters.map((cluster) => ({
            id: cluster.id,
            label: cluster.title,
          }))}
        />
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">{subject.title}</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">{subject.blurb}</p>
        <ClusterCardSections sections={subjectClusterCards(subject)} />
      </main>
    );
  }

  const leaf = leafTopicForTrack(track.id);
  if (leaf) {
    const parsed = await loadParsedTopic(leaf);
    return (
      <main className="w-full max-w-3xl px-4 py-10 sm:px-6">
        <Breadcrumbs
          items={trackCrumbs(track)}
          pageHref={leaf ? topicHref(leaf) : trackHref(track.id)}
          hashCrumbs={parsed.concepts.map((concept) => ({
            id: concept.id,
            label: concept.title,
          }))}
        />
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">{parsed.title}</h1>
        <p className="mt-3 text-base leading-7 text-zinc-600">{parsed.description}</p>
        <p className="mt-2 text-sm text-zinc-500">
          {parsed.concepts.length} concepts · click a title to expand
        </p>
        <div className="mt-8">
          <ConceptList
            concepts={parsed.concepts}
            emptyMessage="No concepts were parsed from this topic."
            groupInterviewSections={isInterviewTopic(leaf)}
          />
        </div>
      </main>
    );
  }

  return (
    <main className="w-full max-w-5xl px-4 py-10 sm:px-6">
      <Breadcrumbs items={trackCrumbs(track)} />
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">{track.title}</h1>
      <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">{track.description}</p>
      <div className="mt-8">
        <CardGrid items={trackBrowseCards(track.id)} />
      </div>
    </main>
  );
}
