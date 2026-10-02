import { INSTRUCTIONS_HREF, splitHref, type NavGroup } from "@/lib/nav";
import { navSubjectClusters } from "@/lib/nav/subjectClusters";
import { stripLocalePrefix } from "@/lib/i18n/paths";

export function hrefInHandbook(
  groups: readonly NavGroup[],
  href: string,
): boolean {
  const { pathname } = splitHref(href);
  const { path } = stripLocalePrefix(pathname);
  if (path === "/" || path === INSTRUCTIONS_HREF) {
    return true;
  }
  for (const group of groups) {
    if (group.href === pathname || group.leafTopic?.href === pathname) {
      return true;
    }
    if (group.hubTopic && group.href === pathname) {
      return true;
    }
    for (const entry of group.entries) {
      switch (entry.kind) {
        case "topic":
          if (entry.topic.href === pathname) {
            return true;
          }
          break;
        case "subject":
          if (entry.subject.href === pathname) {
            return true;
          }
          if (
            navSubjectClusters(entry.subject).some((cluster) =>
              cluster.topics.some((topic) => topic.href === pathname),
            )
          ) {
            return true;
          }
          break;
        case "cluster":
          if (entry.subjectHref === pathname) {
            return true;
          }
          if (entry.cluster.topics.some((topic) => topic.href === pathname)) {
            return true;
          }
          break;
        default: {
          const _never: never = entry;
          return _never;
        }
      }
    }
  }
  return false;
}
