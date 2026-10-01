export function conceptShareUrl(
  origin: string,
  pathname: string,
  conceptId: string,
): string {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${origin}${path}#${encodeURIComponent(conceptId)}`;
}
