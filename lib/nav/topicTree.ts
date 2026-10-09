import type { NavTopic } from "./types";

export function flattenNavTopics(topic: NavTopic): readonly NavTopic[] {
  return [
    topic,
    ...(topic.nestedTopics?.flatMap((nested) => flattenNavTopics(nested)) ??
      []),
  ];
}

export function navTopicTreeContainsHref(
  topic: NavTopic,
  pathname: string,
): boolean {
  if (topic.href === pathname) {
    return true;
  }
  return (
    topic.nestedTopics?.some((nested) =>
      navTopicTreeContainsHref(nested, pathname),
    ) ?? false
  );
}

export function navTopicAtPath(
  topic: NavTopic,
  pathname: string,
): NavTopic | undefined {
  if (topic.href === pathname) {
    return topic;
  }
  for (const nested of topic.nestedTopics ?? []) {
    const hit = navTopicAtPath(nested, pathname);
    if (hit) {
      return hit;
    }
  }
  return undefined;
}
