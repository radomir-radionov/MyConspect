import {
  isInterviewTasksTopic,
  isInterviewTopic,
  type Topic,
} from "@/lib/catalog";
import type { InterviewSection } from "./types";

export function sameTitle(left: string, right: string): boolean {
  return left.trim().toLowerCase() === right.trim().toLowerCase();
}

export function hashIdFrom(hash: string): string {
  return decodeURIComponent(hash.replace(/^#/, ""));
}

type InterviewConcept = {
  readonly interviewSection?: InterviewSection;
};

export function isQuestionCluster(clusterId: string): boolean {
  return (
    clusterId === "interview" ||
    clusterId.endsWith("-interview") ||
    clusterId === "tasks" ||
    clusterId.endsWith("-tasks")
  );
}

export function shouldHideSidebarConcepts(
  topic: Pick<Topic, "slug" | "hideSidebarConcepts" | "grouping"> & {
    readonly title?: string;
  },
): boolean {
  return (
    topic.hideSidebarConcepts === true ||
    isInterviewTopic({ slug: topic.slug, title: topic.title ?? "" }) ||
    isInterviewTasksTopic(topic) ||
    isQuestionCluster(topic.grouping?.cluster ?? "")
  );
}

export function filterInterviewConcepts<T extends InterviewConcept>(
  topic: Pick<Topic, "slug"> & { readonly title?: string },
  concepts: readonly T[],
): readonly T[] {
  if (isInterviewTasksTopic(topic)) {
    return concepts.filter((concept) => concept.interviewSection === "tasks");
  }
  if (isInterviewTopic({ slug: topic.slug, title: topic.title ?? "" })) {
    return concepts.filter((concept) => concept.interviewSection !== "tasks");
  }
  return concepts;
}
