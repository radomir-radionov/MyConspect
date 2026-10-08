import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { handbookNavSections } from "./handbook";
import { searchNav } from "./search";
import {
  clusterNavigateHref,
  groupNavigateHref,
  inferNavRootSection,
  navGroupsForRootSection,
  sectionSwitchHref,
} from "./sections";
import type { NavCluster, NavGroup, NavSubject, NavTopic } from "./types";

function findSubject(
  slug: string,
  sectionId: "conspect" | "interviews" = "conspect",
): NavSubject {
  const groups = navGroupsForRootSection(handbookNavSections("en"), sectionId);
  for (const group of groups) {
    for (const entry of group.entries) {
      if (entry.kind === "subject" && entry.subject.slug === slug) {
        return entry.subject;
      }
    }
  }
  throw new Error(`Subject not found: ${slug} in ${sectionId}`);
}

function findGroup(
  trackId: string,
  sectionId: "conspect" | "interviews" = "conspect",
) {
  return navGroupsForRootSection(handbookNavSections("en"), sectionId).find(
    (group) => group.id === trackId,
  );
}

function allSubjectClusters(subject: NavSubject): readonly NavCluster[] {
  return [
    ...subject.clusters,
    ...(subject.sections?.flatMap((section) => section.clusters) ?? []),
    ...(subject.clustersAfterSections ?? []),
  ];
}

function interviewTopicsInGroup(group: NavGroup): readonly NavTopic[] {
  return group.entries
    .filter((entry) => entry.kind === "topic")
    .map((entry) => entry.topic);
}

function tasksClusterInGroup(group: NavGroup): NavCluster | undefined {
  const entry = group.entries.find(
    (item) => item.kind === "cluster" && item.cluster.id === "tasks",
  );
  return entry?.kind === "cluster" ? entry.cluster : undefined;
}

describe("handbookNavSections layout", () => {
  it("places study tracks under Conspect and interviews under Interviews", () => {
    const sections = handbookNavSections("en");
    assert.equal(sections.length, 2);
    assert.equal(sections[0]?.id, "conspect");
    assert.equal(sections[1]?.id, "interviews");

    const conspectFrontend = findGroup("frontend", "conspect");
    const interviewsFrontend = findGroup("frontend", "interviews");
    assert.ok(conspectFrontend);
    assert.ok(interviewsFrontend);
    assert.equal(
      conspectFrontend?.entries.some(
        (entry) => entry.kind === "cluster" && entry.cluster.id === "interview",
      ),
      false,
    );
    assert.equal(
      interviewsFrontend?.entries.some(
        (entry) => entry.kind === "cluster" && entry.cluster.id === "interview",
      ),
      false,
    );
    assert.ok(
      interviewTopicsInGroup(interviewsFrontend!).some(
        (topic) => topic.slug === "html-interview",
      ),
    );
    assert.equal(findGroup("behavior", "conspect"), undefined);
    assert.ok(findGroup("behavior", "interviews")?.leafTopic);
  });

  it("marks TypeScript Reference as flat appendix nav", () => {
    const typescript = findSubject("typescript");
    const reference = typescript.sections?.find(
      (section) => section.id === "reference",
    );
    assert.equal(reference?.flatNav, true);
    assert.equal(reference?.collapsible, true);
  });

  it("places Utility Types in its own section between handbook and Reference", () => {
    const typescript = findSubject("typescript");
    const sectionIds = typescript.sections?.map((section) => section.id);
    assert.deepEqual(sectionIds, ["utility-types", "reference"]);
    const utility = typescript.sections?.find(
      (section) => section.id === "utility-types",
    );
    assert.equal(utility?.collapsible, true);
    assert.equal(utility?.flatNav, true);
    const utilitySection = typescript.sections?.find(
      (section) => section.id === "utility-types",
    );
    assert.ok(utilitySection);
    assert.ok(
      utilitySection?.clusters.some(
        (cluster) => cluster.id === "utility-types",
      ),
    );
    assert.ok(
      utilitySection?.clusters.some(
        (cluster) => cluster.id === "utility-object",
      ),
    );
    const referenceSection = typescript.sections?.find(
      (section) => section.id === "reference",
    );
    assert.ok(
      referenceSection?.clusters.every(
        (cluster) => cluster.id !== "utility-types",
      ),
    );
  });

  it("keeps Vue and Nuxt sections as expandable cluster rows", () => {
    const vueNuxt = findSubject("vue-nuxt");
    for (const section of vueNuxt.sections ?? []) {
      assert.equal(section.flatNav, undefined);
      assert.ok(section.clusters.length > 0);
    }
  });

  it("keeps TypeScript interview topics under Interviews only", () => {
    const typescript = findSubject("typescript");
    assert.equal(typescript.clustersAfterSections, undefined);
    const interviewsFrontend = findGroup("frontend", "interviews");
    assert.ok(interviewsFrontend);
    const tasks = tasksClusterInGroup(interviewsFrontend);
    assert.ok(
      interviewTopicsInGroup(interviewsFrontend).some(
        (topic) => topic.slug === "ts-interview",
      ),
    );
    assert.ok(
      tasks?.topics.some((topic) => topic.slug === "ts-interview-tasks"),
    );
    assert.equal(
      interviewTopicsInGroup(interviewsFrontend).find(
        (topic) => topic.slug === "ts-interview",
      )?.hideSidebarConcepts,
      true,
    );
  });

  it("hides sidebar concepts for interview and task topics", () => {
    const interviewsFrontend = findGroup("frontend", "interviews");
    assert.ok(interviewsFrontend);
    const tasks = tasksClusterInGroup(interviewsFrontend);
    assert.ok(
      interviewTopicsInGroup(interviewsFrontend).every(
        (topic) => topic.hideSidebarConcepts,
      ),
    );
    assert.ok(tasks?.topics.every((topic) => topic.hideSidebarConcepts));
    assert.ok(
      (interviewTopicsInGroup(interviewsFrontend)[0]?.concepts.length ?? 0) > 0,
    );
  });

  it("hides sidebar concepts for every interview and task topic", () => {
    for (const section of handbookNavSections("en")) {
      for (const group of section.groups) {
        for (const entry of group.entries) {
          if (section.id === "interviews" && entry.kind === "topic") {
            assert.equal(
              entry.topic.hideSidebarConcepts,
              true,
              `${group.id}/${entry.topic.slug}`,
            );
          }
          if (
            section.id === "interviews" &&
            entry.kind === "cluster" &&
            entry.cluster.id === "tasks"
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
    }
  });

  it("lifts Node.js interview topics to the Backend Interviews track", () => {
    const nodejs = findSubject("nodejs");
    assert.equal(
      allSubjectClusters(nodejs).some((cluster) =>
        /interview|tasks/i.test(cluster.id),
      ),
      false,
    );
    const backend = findGroup("backend", "interviews");
    assert.ok(backend);
    const interviewTopics = interviewTopicsInGroup(backend);
    assert.equal(
      interviewTopics.find((topic) => topic.slug === "nodejs-interview")?.title,
      "Node.js",
    );
    assert.equal(
      interviewTopics.find((topic) => topic.slug === "express-questions")
        ?.title,
      "Express",
    );
  });

  it("lifts Vue and Nuxt interview topics to the Frontend Interviews track", () => {
    const vueNuxt = findSubject("vue-nuxt");
    const vueInterview = vueNuxt.sections
      ?.find((section) => section.id === "vue")
      ?.clusters.find((cluster) => cluster.id === "interview");
    const nuxtInterview = vueNuxt.sections
      ?.find((section) => section.id === "nuxt")
      ?.clusters.find((cluster) => cluster.id === "nuxt-interview");
    assert.equal(vueInterview, undefined);
    assert.equal(nuxtInterview, undefined);

    const frontend = findGroup("frontend", "interviews");
    assert.ok(frontend);
    const interviewTopics = interviewTopicsInGroup(frontend);
    const vue = interviewTopics.find((topic) => topic.slug === "vue-interview");
    const nuxt = interviewTopics.find(
      (topic) => topic.slug === "nuxt-interview",
    );
    assert.equal(vue?.title, "Vue");
    assert.equal(nuxt?.title, "Nuxt");
    assert.equal(vue?.hideSidebarConcepts, true);
    assert.equal(nuxt?.hideSidebarConcepts, true);
    assert.ok((vue?.concepts.length ?? 0) > 0);
  });

  it("hides sidebar concepts on the behavior leaf topic", () => {
    const behavior = findGroup("behavior", "interviews");
    assert.equal(behavior?.leafTopic?.hideSidebarConcepts, true);
    assert.ok((behavior?.leafTopic?.concepts.length ?? 0) > 0);
  });

  it("promotes a single testing interview topic to a leaf track", () => {
    const testing = findGroup("testing", "interviews");
    assert.ok(testing);
    assert.equal(testing.entries.length, 0);
    assert.equal(testing.leafTopic?.slug, "interview");
    assert.equal(testing.leafTopic?.href, "/en/testing/interview");
    assert.equal(testing.leafTopic?.hideSidebarConcepts, true);
    assert.equal(
      groupNavigateHref(testing, "interviews"),
      "/en/testing/interview",
    );
  });

  it("infers root section from pathname", () => {
    assert.equal(inferNavRootSection("/en/frontend/css"), "conspect");
    assert.equal(
      inferNavRootSection("/en/frontend/html-interview"),
      "interviews",
    );
    assert.equal(
      inferNavRootSection("/en/frontend/redux-questions"),
      "interviews",
    );
    assert.equal(
      inferNavRootSection("/en/frontend/web-api-websockets"),
      "interviews",
    );
    assert.equal(inferNavRootSection("/en/behavior"), "interviews");
  });

  it("switches sections on the same track when possible", () => {
    const sections = handbookNavSections("en");
    assert.equal(
      sectionSwitchHref(sections, "/en/frontend/css", "interviews"),
      "/en/frontend/css-interview",
    );
    assert.equal(
      sectionSwitchHref(sections, "/en/frontend/html-interview", "conspect"),
      "/en/frontend/html-structure",
    );
    assert.equal(
      sectionSwitchHref(sections, "/en/frontend", "interviews"),
      "/en/frontend/html-interview",
    );
    assert.equal(
      sectionSwitchHref(sections, "/en/frontend/redux-questions", "conspect"),
      "/en/frontend/react-redux",
    );
    assert.equal(
      sectionSwitchHref(
        sections,
        "/en/frontend/html-interview-tasks",
        "conspect",
      ),
      "/en/frontend/html-structure",
    );
    assert.equal(
      sectionSwitchHref(sections, "/en/frontend/react-redux", "interviews"),
      "/en/frontend/redux-questions",
    );
  });

  it("keeps interview sidebar links on interview topics", () => {
    const frontend = findGroup("frontend", "interviews");
    assert.ok(frontend);
    assert.equal(
      groupNavigateHref(frontend, "interviews"),
      "/en/frontend/html-interview",
    );
    const htmlInterview = interviewTopicsInGroup(frontend).find(
      (topic) => topic.slug === "html-interview",
    );
    assert.equal(htmlInterview?.href, "/en/frontend/html-interview");
    const tasks = tasksClusterInGroup(frontend);
    assert.ok(tasks);
    assert.equal(
      clusterNavigateHref(tasks, "interviews", frontend.href),
      tasks.topics[0]?.href,
    );
  });

  it("falls back to the first group when the track is missing", () => {
    const sections = handbookNavSections("en");
    assert.equal(
      sectionSwitchHref(sections, "/en/behavior", "conspect"),
      findGroup("frontend", "conspect")?.href,
    );
  });

  it("lists compiler fundamentals concepts on one topic like The Basics", () => {
    const frontend = findGroup("frontend", "conspect");
    assert.ok(frontend);
    const ts = frontend.entries.find(
      (entry) =>
        entry.kind === "subject" && entry.subject.slug === "typescript",
    );
    assert.ok(ts && ts.kind === "subject");
    const cluster = ts.subject.clusters.find(
      (item) => item.id === "compiler-fundamentals",
    );
    const basics = ts.subject.clusters.find((item) => item.id === "basics");
    assert.ok(cluster && basics);
    assert.equal(cluster.topics.length, 1);
    assert.equal(basics.topics.length, 1);
    assert.equal(cluster.topics[0].concepts.length, 8);
  });

  it("keeps conspect and interview search corpora separate", () => {
    const sections = handbookNavSections("en");
    const conspectGroups = navGroupsForRootSection(sections, "conspect");
    const interviewGroups = navGroupsForRootSection(sections, "interviews");

    assert.ok(conspectGroups.length > 0);
    assert.ok(interviewGroups.length > 0);
    assert.notEqual(conspectGroups[0], interviewGroups[0]);

    const conspectSolid = searchNav(conspectGroups, "solid", "titles");
    assert.ok(conspectSolid.groups.length > 0);
    assert.ok(conspectSolid.firstHref);
    assert.equal(inferNavRootSection(conspectSolid.firstHref!), "conspect");

    const conspectCompiler = searchNav(
      conspectGroups,
      "compiler fundamentals",
      "titles",
    );
    assert.ok(conspectCompiler.groups.length > 0);
    assert.equal(
      searchNav(interviewGroups, "compiler fundamentals", "titles").groups
        .length,
      0,
    );
  });
});
