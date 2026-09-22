"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { LOCALES, type Locale } from "@/lib/i18n/locales";
import { pathWithoutLocale, withLocale } from "@/lib/i18n/paths";
import { getHash, getServerHash, queueHandbookHref, subscribeHash } from "./hash";

const LABELS: Record<Locale, string> = {
  en: "EN",
  ru: "RU",
};

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname() ?? `/${locale}`;
  const hash = useSyncExternalStore(subscribeHash, getHash, getServerHash);
  const rest = pathWithoutLocale(pathname);
  const pathRest = rest === "/" ? "/" : rest;

  return (
    <div
      className="inline-flex items-center gap-0.5 rounded-md border border-zinc-200 p-0.5 dark:border-zinc-700"
      role="group"
      aria-label="Language"
    >
      {LOCALES.map((item) => {
        const href = `${withLocale(item, pathRest)}${hash}`;
        const active = item === locale;
        return (
          <Link
            key={item}
            href={href}
            hrefLang={item}
            lang={item}
            scroll={false}
            aria-current={active ? "page" : undefined}
            onClick={() => {
              if (active) {
                return;
              }
              queueHandbookHref(href);
            }}
            className={
              active
                ? "rounded px-1.5 py-0.5 text-xs font-semibold text-zinc-900 dark:text-zinc-50"
                : "rounded px-1.5 py-0.5 text-xs font-medium text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            }
          >
            {LABELS[item]}
          </Link>
        );
      })}
    </div>
  );
}
