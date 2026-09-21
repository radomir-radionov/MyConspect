import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CardGrid, ClusterCardSections } from "@/components/catalog";
import { ConceptList } from "@/components/topic";
import {
  TRACKS,
  getTrack,
  isInterviewTopic,
  isTrackId,
  leafTopicForTrack,
  subjectClusterCards,
  subjectForTrack,
  trackBrowseCards,
} from "@/lib/catalog";
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
      <main className="w-full max-w-5xl px-4 pt-5 pb-10 sm:px-6">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">{subject.title}</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">{subject.blurb}</p>
        <ClusterCardSections sections={subjectClusterCards(subject)} />
      </main>
    );
  }

  const leaf = leafTopicForTrack(track.id);
  if (leaf) {
    const parsed = await loadParsedTopic(leaf);
    return (
      <main className="w-full max-w-3xl px-4 pt-5 pb-10 sm:px-6">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">{parsed.title}</h1>
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
    <main className="w-full max-w-5xl px-4 pt-5 pb-10 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">{track.title}</h1>
      <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">{track.description}</p>
      <div className="mt-8">
        <CardGrid items={trackBrowseCards(track.id)} />
      </div>
    </main>
  );
}
