import type { NavCluster, NavSubject } from "./types";

export function navSubjectClusters(subject: NavSubject): readonly NavCluster[] {
  if (subject.sections?.length) {
    return [
      ...subject.clusters,
      ...subject.sections.flatMap((section) => section.clusters),
      ...(subject.clustersAfterSections ?? []),
    ];
  }
  return subject.clusters;
}
