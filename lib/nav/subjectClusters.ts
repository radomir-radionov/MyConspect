import type { NavCluster, NavSubject } from "./types";

export function navSubjectClusters(subject: NavSubject): readonly NavCluster[] {
  if (subject.sections?.length) {
    return subject.sections.flatMap((section) => section.clusters);
  }
  return subject.clusters;
}
