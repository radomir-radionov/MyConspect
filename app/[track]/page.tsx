import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CardGrid } from "@/components/CardGrid";
import { SiteHeader } from "@/components/SiteHeader";
import {
  TRACKS,
  isTrackId,
  topicHref,
  topicsForTrack,
} from "@/lib/content/catalog";
import { getTrack } from "@/lib/content/load";

type TrackParams = { track: string };

export const dynamicParams = false;

export function generateStaticParams(): TrackParams[] {
  return TRACKS.map((track) => ({ track: track.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<TrackParams>;
}): Promise<Metadata> {
  const { track: trackId } = await params;
  const track = getTrack(trackId);
  if (!track) {
    return { title: "Not found" };
  }
  return {
    title: track.title,
    description: track.description,
  };
}

export default async function TrackPage({
  params,
}: {
  params: Promise<TrackParams>;
}) {
  const { track: trackId } = await params;
  if (!isTrackId(trackId)) {
    notFound();
  }
  const track = getTrack(trackId);
  if (!track) {
    notFound();
  }
  const topics = topicsForTrack(track.id);

  return (
    <>
      <SiteHeader crumbs={[{ href: "/", label: "Tracks" }, { label: track.title }]} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">{track.title}</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">{track.description}</p>
        <div className="mt-8">
          <CardGrid
            items={topics.map((topic) => ({
              href: topicHref(topic),
              title: topic.title,
              description: topic.blurb,
            }))}
          />
        </div>
      </main>
    </>
  );
}
