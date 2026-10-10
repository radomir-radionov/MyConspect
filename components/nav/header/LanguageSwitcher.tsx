"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";
import { isLocale, LOCALES, type Locale } from "@/lib/i18n/locales";
import { pathWithoutLocale, withLocale } from "@/lib/i18n/paths";
import {
  followHandbookHref,
  getHash,
  getServerHash,
  queueHandbookHref,
  subscribeHash,
} from "./hash";

const LABELS: Record<Locale, string> = {
  en: "EN",
  ru: "RU",
};

export function LanguageSwitcher({
  locale,
  variant = "links",
}: {
  locale: Locale;
  variant?: "links" | "select";
}) {
  const pathname = usePathname() ?? `/${locale}`;
  const router = useRouter();
  const hash = useSyncExternalStore(subscribeHash, getHash, getServerHash);
  const rest = pathWithoutLocale(pathname);
  const pathRest = rest === "/" ? "/" : rest;

  if (variant === "select") {
    return (
      <label className="inline-flex items-center">
        <span className="sr-only">Language</span>
        <select
          aria-label="Language"
          value={locale}
          onChange={(event) => {
            const next = event.target.value;
            if (!isLocale(next) || next === locale) {
              return;
            }
            const href = `${withLocale(next, pathRest)}${hash}`;
            followHandbookHref(href, pathname, (path) => {
              router.push(path, { scroll: false });
            });
          }}
          className="h-8 cursor-pointer rounded-md border border-zinc-200 bg-zinc-50 px-1.5 text-xs font-semibold text-zinc-900 outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-500"
        >
          {LOCALES.map((item) => (
            <option key={item} value={item} lang={item}>
              {LABELS[item]}
            </option>
          ))}
        </select>
      </label>
    );
  }

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
