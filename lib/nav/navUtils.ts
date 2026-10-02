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
