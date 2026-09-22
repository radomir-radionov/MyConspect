import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CardGrid } from "@/components/catalog";
import { TRACKS } from "@/lib/catalog";
import { catalogBlurb } from "@/lib/i18n/catalog";
import { isLocale, type Locale } from "@/lib/i18n/locales";
import { withLocale } from "@/lib/i18n/paths";
import { SITE_DESCRIPTION } from "@/lib/site";

const COPY: Record<Locale, { title: string; description: string }> = {
  en: {
    title: "Study handbook",
    description: SITE_DESCRIPTION,
  },
  ru: {
    title: "Учебный справочник",
    description:
      "Конспект для подготовки к собеседованиям: HTML, CSS, JavaScript, React и смежные темы.",
  },
};

export async function generateMetadata({
  params,
}: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) {
    return { title: "Not found" };
  }
  const copy = COPY[localeParam];
  return {
    title: copy.title,
    description: copy.description,
    alternates: {
      languages: {
        en: "/en",
        ru: "/ru",
      },
    },
  };
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) {
    notFound();
  }
  const locale = localeParam;
  const copy = COPY[locale];

  return (
    <main className="w-full max-w-5xl px-4 pt-5 pb-10 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {copy.title}
      </h1>
      <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
        {copy.description}
      </p>
      <div className="mt-8">
        <CardGrid
          items={TRACKS.map((track) => ({
            href: withLocale(locale, `/${track.id}`),
            title: track.title,
            description: catalogBlurb(locale, track.description),
          }))}
        />
      </div>
    </main>
  );
}
