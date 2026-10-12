import type { NavCluster, NavTopic } from "@/lib/nav";
import { sameTitle } from "@/lib/nav/navUtils";

export function isTopicAliasCluster(cluster: NavCluster): boolean {
  return Boolean(aliasTopicForCluster(cluster));
}

export function aliasTopicForCluster(
  cluster: NavCluster,
): NavTopic | undefined {
  const only = cluster.topics.length === 1 ? cluster.topics[0] : undefined;
  if (!only || !sameTitle(cluster.title, only.title)) {
    return undefined;
  }
  return only;
}
