function normalizedPath(pathname: string): string {
  return pathname.startsWith("/") ? pathname : `/${pathname}`;
}

export function pageShareUrl(origin: string, pathname: string): string {
  return `${origin}${normalizedPath(pathname)}`;
}

export function conceptShareUrl(
  origin: string,
  pathname: string,
  conceptId: string,
): string {
  return `${pageShareUrl(origin, pathname)}#${encodeURIComponent(conceptId)}`;
}
