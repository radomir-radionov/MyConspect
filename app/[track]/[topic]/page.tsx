import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ConceptList } from "@/components/topic";
import { TOPICS, getTrack } from "@/lib/catalog";
import { loadTopicPage } from "@/lib/parse";

export const dynamicParams = false;

export function generateStaticParams() {
  return TOPICS.map((topic) => ({ track: topic.track, topic: topic.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[track]/[topic]">): Promise<Metadata> {
  const { track, topic: slug } = await params;
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
  const loaded = await loadTopicPage(trackId, slug);
  const track = getTrack(trackId);
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
        />
      </div>
    </main>
  );
}
