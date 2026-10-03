import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { handbookNav } from "./handbook";
import type { NavCluster, NavSubject } from "./types";

function findSubject(slug: string): NavSubject {
  for (const group of handbookNav("en")) {
    for (const entry of group.entries) {
      if (entry.kind === "subject" && entry.subject.slug === slug) {
        return entry.subject;
      }
    }
  }
  throw new Error(`Subject not found: ${slug}`);
}

function allSubjectClusters(subject: NavSubject): readonly NavCluster[] {
  return [
    ...subject.clusters,
    ...(subject.sections?.flatMap((section) => section.clusters) ?? []),
    ...(subject.clustersAfterSections ?? []),
  ];
}

describe("handbookNav section layout", () => {
  it("marks TypeScript Reference as flat appendix nav", () => {
    const typescript = findSubject("typescript");
    const reference = typescript.sections?.find(
      (section) => section.id === "reference",
    );
    assert.equal(reference?.flatNav, true);
    assert.equal(reference?.collapsible, true);
  });

  it("keeps Vue and Nuxt sections as expandable cluster rows", () => {
    const vueNuxt = findSubject("vue-nuxt");
    for (const section of vueNuxt.sections ?? []) {
      assert.equal(section.flatNav, undefined);
      assert.ok(section.clusters.length > 0);
    }
  });

  it("places TypeScript Interview and Tasks after Reference", () => {
    const typescript = findSubject("typescript");
    assert.deepEqual(
      typescript.clustersAfterSections?.map((cluster) => cluster.id),
      ["interview", "tasks"],
    );
  });

  it("hides sidebar concepts for interview and task topics", () => {
    const typescript = findSubject("typescript");
    const interview = typescript.clustersAfterSections?.find(
      (cluster) => cluster.id === "interview",
    );
    const tasks = typescript.clustersAfterSections?.find(
      (cluster) => cluster.id === "tasks",
    );
    assert.equal(interview?.topics[0]?.hideSidebarConcepts, true);
    assert.equal(tasks?.topics[0]?.hideSidebarConcepts, true);
    assert.ok((interview?.topics[0]?.concepts.length ?? 0) > 0);
  });

  it("hides sidebar concepts for every interview and task topic", () => {
    for (const group of handbookNav("en")) {
      for (const entry of group.entries) {
        if (entry.kind !== "subject") {
          continue;
        }
        for (const cluster of allSubjectClusters(entry.subject)) {
          for (const topic of cluster.topics) {
            const isInterviewLike =
              /interview|tasks/i.test(topic.slug) ||
              /interview|tasks/i.test(cluster.id);
            if (!isInterviewLike) {
              continue;
            }
            assert.equal(
              topic.hideSidebarConcepts,
              true,
              `${entry.subject.slug}/${cluster.id}/${topic.slug}`,
            );
          }
        }
      }
    }
  });

  it("keeps Vue and Nuxt interview clusters as cluster rows without concept children", () => {
    const vueNuxt = findSubject("vue-nuxt");
    const vueInterview = vueNuxt.sections
      ?.find((section) => section.id === "vue")
      ?.clusters.find((cluster) => cluster.id === "interview");
    const nuxtInterview = vueNuxt.sections
      ?.find((section) => section.id === "nuxt")
      ?.clusters.find((cluster) => cluster.id === "nuxt-interview");

    assert.equal(vueInterview?.topics[0]?.hideSidebarConcepts, true);
    assert.equal(nuxtInterview?.topics[0]?.hideSidebarConcepts, true);
    assert.ok((vueInterview?.topics[0]?.concepts.length ?? 0) > 0);
  });

  it("hides sidebar concepts on the behavior leaf topic", () => {
    const behavior = handbookNav("en").find((group) => group.id === "behavior");
    assert.equal(behavior?.leafTopic?.hideSidebarConcepts, true);
    assert.ok((behavior?.leafTopic?.concepts.length ?? 0) > 0);
  });
});
