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

  it("lifts TypeScript interview topics to the Frontend track", () => {
    const typescript = findSubject("typescript");
    assert.equal(typescript.clustersAfterSections, undefined);
    const frontend = handbookNav("en").find((group) => group.id === "frontend");
    const interview = frontend?.entries.find(
      (entry) => entry.kind === "cluster" && entry.cluster.id === "interview",
    );
    const tasks = frontend?.entries.find(
      (entry) => entry.kind === "cluster" && entry.cluster.id === "tasks",
    );
    assert.equal(interview?.kind, "cluster");
    assert.equal(tasks?.kind, "cluster");
    if (interview?.kind !== "cluster" || tasks?.kind !== "cluster") {
      return;
    }
    assert.ok(
      interview.cluster.topics.some((topic) => topic.slug === "ts-interview"),
    );
    assert.ok(
      tasks.cluster.topics.some((topic) => topic.slug === "ts-interview-tasks"),
    );
    assert.equal(
      interview.cluster.topics.find((topic) => topic.slug === "ts-interview")
        ?.hideSidebarConcepts,
      true,
    );
  });

  it("hides sidebar concepts for interview and task topics", () => {
    const frontend = handbookNav("en").find((group) => group.id === "frontend");
    const interview = frontend?.entries.find(
      (entry) => entry.kind === "cluster" && entry.cluster.id === "interview",
    );
    const tasks = frontend?.entries.find(
      (entry) => entry.kind === "cluster" && entry.cluster.id === "tasks",
    );
    assert.equal(interview?.kind, "cluster");
    assert.equal(tasks?.kind, "cluster");
    if (interview?.kind !== "cluster" || tasks?.kind !== "cluster") {
      return;
    }
    assert.ok(
      interview.cluster.topics.every((topic) => topic.hideSidebarConcepts),
    );
    assert.ok(tasks.cluster.topics.every((topic) => topic.hideSidebarConcepts));
    assert.ok((interview.cluster.topics[0]?.concepts.length ?? 0) > 0);
  });

  it("hides sidebar concepts for every interview and task topic", () => {
    for (const group of handbookNav("en")) {
      for (const entry of group.entries) {
        if (
          entry.kind === "cluster" &&
          /interview|tasks/i.test(entry.cluster.id)
        ) {
          for (const topic of entry.cluster.topics) {
            assert.equal(
              topic.hideSidebarConcepts,
              true,
              `${group.id}/${entry.cluster.id}/${topic.slug}`,
            );
          }
        }
        if (entry.kind !== "subject") {
          continue;
        }
        for (const cluster of allSubjectClusters(entry.subject)) {
          if (!/interview|tasks/i.test(cluster.id)) {
            continue;
          }
          for (const topic of cluster.topics) {
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

  it("lifts Node.js interview topics to the Backend track", () => {
    const nodejs = findSubject("nodejs");
    assert.equal(
      allSubjectClusters(nodejs).some((cluster) =>
        /interview|tasks/i.test(cluster.id),
      ),
      false,
    );
    const backend = handbookNav("en").find((group) => group.id === "backend");
    const interview = backend?.entries.find(
      (entry) => entry.kind === "cluster" && entry.cluster.id === "interview",
    );
    assert.equal(interview?.kind, "cluster");
    if (interview?.kind !== "cluster") {
      return;
    }
    assert.equal(
      interview.cluster.topics.find(
        (topic) => topic.slug === "nodejs-interview",
      )?.title,
      "Node.js",
    );
    assert.equal(
      interview.cluster.topics.find(
        (topic) => topic.slug === "express-questions",
      )?.title,
      "Express",
    );
  });

  it("lifts Vue and Nuxt interview topics to the Frontend track", () => {
    const vueNuxt = findSubject("vue-nuxt");
    const vueInterview = vueNuxt.sections
      ?.find((section) => section.id === "vue")
      ?.clusters.find((cluster) => cluster.id === "interview");
    const nuxtInterview = vueNuxt.sections
      ?.find((section) => section.id === "nuxt")
      ?.clusters.find((cluster) => cluster.id === "nuxt-interview");
    assert.equal(vueInterview, undefined);
    assert.equal(nuxtInterview, undefined);

    const frontend = handbookNav("en").find((group) => group.id === "frontend");
    const interview = frontend?.entries.find(
      (entry) => entry.kind === "cluster" && entry.cluster.id === "interview",
    );
    assert.equal(interview?.kind, "cluster");
    if (interview?.kind !== "cluster") {
      return;
    }
    const vue = interview.cluster.topics.find(
      (topic) => topic.slug === "vue-interview",
    );
    const nuxt = interview.cluster.topics.find(
      (topic) => topic.slug === "nuxt-interview",
    );
    assert.equal(vue?.title, "Vue");
    assert.equal(nuxt?.title, "Nuxt");
    assert.equal(vue?.hideSidebarConcepts, true);
    assert.equal(nuxt?.hideSidebarConcepts, true);
    assert.ok((vue?.concepts.length ?? 0) > 0);
  });

  it("hides sidebar concepts on the behavior leaf topic", () => {
    const behavior = handbookNav("en").find((group) => group.id === "behavior");
    assert.equal(behavior?.leafTopic?.hideSidebarConcepts, true);
    assert.ok((behavior?.leafTopic?.concepts.length ?? 0) > 0);
  });
});
