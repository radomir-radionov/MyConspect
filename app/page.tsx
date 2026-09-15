import type { Metadata } from "next";
import { CardGrid } from "@/components/CardGrid";
import { SiteHeader } from "@/components/SiteHeader";
import { TRACKS } from "@/lib/content/catalog";
import { SITE_DESCRIPTION } from "@/lib/site";

export const metadata: Metadata = {
  title: "Study handbook",
  description: SITE_DESCRIPTION,
};

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">Study handbook</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">{SITE_DESCRIPTION}</p>
        <div className="mt-8">
          <CardGrid
            items={TRACKS.map((track) => ({
              href: `/${track.id}`,
              title: track.title,
              description: track.description,
            }))}
          />
        </div>
      </main>
    </>
  );
}
