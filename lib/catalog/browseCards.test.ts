import assert from "node:assert/strict";
import test from "node:test";
import {
  SUBJECTS,
  subjectClusterCards,
  trackBrowseCards,
  trackQuestionSections,
} from "@/lib/catalog";

test("subjectClusterCards includes cluster blurb for single-topic clusters", () => {
  for (const subject of SUBJECTS) {
    const cards = subjectClusterCards(subject);
    for (const { cluster, items } of cards) {
      if (items.length !== 1) {
        continue;
      }
      assert.equal(items[0].title, cluster.title);
      assert.ok(
        items[0].description.length > 0,
        `${subject.slug}/${cluster.id}: missing description`,
      );
      assert.equal(items[0].description, cluster.blurb);
    }
  }
});

test("subjectClusterCards omits interview and tasks clusters from conspect hubs", () => {
  const html = SUBJECTS.find((subject) => subject.slug === "html");
  assert.ok(html);
  const cards = subjectClusterCards(html);
  assert.equal(
    cards.some((entry) => entry.cluster.id === "interview"),
    false,
  );
  assert.equal(
    cards.some((entry) => entry.cluster.id === "tasks"),
    false,
  );
  assert.ok(cards.some((entry) => entry.cluster.id === "additional"));
});

test("trackBrowseCards includes subject and topic blurbs", () => {
  const cards = trackBrowseCards("frontend");
  assert.ok(cards.length > 0);
  for (const card of cards) {
    assert.ok(
      card.description.length > 0,
      `missing description for ${card.title}`,
    );
  }
});

test("trackQuestionSections lifts interview and tasks onto the track", () => {
  const sections = trackQuestionSections("frontend");
  const interview = sections.find((section) => section.id === "interview");
  const tasks = sections.find((section) => section.id === "tasks");
  assert.ok(interview);
  assert.ok(tasks);
  assert.equal(
    interview.items.find((item) => item.href === "/frontend/html-interview")
      ?.title,
    "HTML",
  );
  assert.equal(
    interview.items.find((item) => item.href === "/frontend/vue-interview")
      ?.title,
    "Vue",
  );
  assert.equal(
    interview.items.find((item) => item.href === "/frontend/nuxt-interview")
      ?.title,
    "Nuxt",
  );
  assert.equal(
    interview.items.find((item) => item.href === "/frontend/redux-questions")
      ?.title,
    "Redux",
  );
  assert.equal(tasks.items[0]?.title, "HTML");
  assert.ok(tasks.items.every((item) => item.href.endsWith("-tasks")));
  assert.equal(
    trackBrowseCards("frontend").some((card) => card.title === "Interview"),
    false,
  );
});
