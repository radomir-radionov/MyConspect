import { DEFAULT_LOCALE, isLocale, type Locale } from "./locales";

/** Prefix a root-relative handbook path with the locale segment. */
export function withLocale(locale: Locale, href: string): string {
  if (!href || href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:")) {
    return href;
  }
  if (href.startsWith("#")) {
    return href;
  }
  const hashIndex = href.indexOf("#");
  const pathPart = hashIndex === -1 ? href : href.slice(0, hashIndex);
  const hash = hashIndex === -1 ? "" : href.slice(hashIndex);
  const normalized = pathPart.startsWith("/") ? pathPart : `/${pathPart}`;
  if (normalized === "/") {
    return `/${locale}${hash}`;
  }
  const stripped = stripLocalePrefix(normalized);
  return `/${locale}${stripped.path}${hash}`;
}

export function homeHref(locale: Locale): string {
  return `/${locale}`;
}

export function instructionsHref(locale: Locale): string {
  return `/${locale}/instructions`;
}

export function stripLocalePrefix(pathname: string): { locale: Locale; path: string } {
  const clean = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const segments = clean.split("/");
  const maybeLocale = segments[1];
  if (maybeLocale && isLocale(maybeLocale)) {
    const rest = `/${segments.slice(2).join("/")}`;
    return {
      locale: maybeLocale,
      path: rest === "/" ? "/" : rest.replace(/\/$/, "") || "/",
    };
  }
  return { locale: DEFAULT_LOCALE, path: clean === "/" ? "/" : clean.replace(/\/$/, "") || "/" };
}

export function localeFromPathname(pathname: string): Locale {
  return stripLocalePrefix(pathname).locale;
}

/** Path without locale, preserving hash (for switching language). */
export function pathWithoutLocale(pathname: string): string {
  const hashIndex = pathname.indexOf("#");
  const pathOnly = hashIndex === -1 ? pathname : pathname.slice(0, hashIndex);
  const hash = hashIndex === -1 ? "" : pathname.slice(hashIndex);
  const { path } = stripLocalePrefix(pathOnly);
  return `${path === "/" ? "" : path}${hash}` || "/";
}
