import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ConceptList } from "@/components/ConceptList";
import { SiteHeader } from "@/components/SiteHeader";
import { TOPICS, getTrack } from "@/lib/content/catalog";
import { loadTopicPage } from "@/lib/content/load";

type TopicParams = { track: string; topic: string };

export const dynamicParams = false;

export function generateStaticParams(): TopicParams[] {
  return TOPICS.map((topic) => ({ track: topic.track, topic: topic.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<TopicParams>;
}): Promise<Metadata> {
  const { track, topic: slug } = await params;
  const loaded = loadTopicPage(track, slug);
  if (!loaded) {
    return { title: "Not found" };
  }
  return {
    title: loaded.parsed.title,
    description: loaded.parsed.description,
  };
}

export default async function TopicPage({
  params,
}: {
  params: Promise<TopicParams>;
}) {
  const { track: trackId, topic: slug } = await params;
  const loaded = loadTopicPage(trackId, slug);
  const track = getTrack(trackId);
  if (!loaded || !track) {
    notFound();
  }

  return (
    <>
      <SiteHeader
        crumbs={[
          { href: "/", label: "Tracks" },
          { href: `/${track.id}`, label: track.title },
          { label: loaded.topic.title },
        ]}
      />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
          {loaded.parsed.title}
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-zinc-600">
          {loaded.parsed.description}
        </p>
        <p className="mt-2 text-sm text-zinc-500">
          {loaded.parsed.concepts.length} concepts · click a title to expand
        </p>
        <div className="mt-8">
          <ConceptList concepts={loaded.parsed.concepts} />
        </div>
      </main>
    </>
  );
}
