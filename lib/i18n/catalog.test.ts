import assert from "node:assert/strict";
import test from "node:test";
import { SUBJECTS, TOPICS, TRACKS } from "@/lib/catalog";
import { catalogBlurb } from "./catalog";

test("catalogBlurb returns English unchanged for en", () => {
  assert.equal(
    catalogBlurb(
      "en",
      "Document skeleton, metadata, elements, and attributes.",
    ),
    "Document skeleton, metadata, elements, and attributes.",
  );
});

test("catalogBlurb translates HTML Structure card for ru", () => {
  assert.equal(
    catalogBlurb(
      "ru",
      "Document skeleton, metadata, elements, and attributes.",
    ),
    "Каркас документа, метаданные, элементы и атрибуты.",
  );
});

const PENDING_RU_BLURBS = new Set([
  "Core tips, skills, rules, plugins, subagents, hooks, slash commands, and questions.",
  "Task delegation, built-in explore/shell/browser, custom agents.",
  "Task delegation, built-in explore/shell/browser, custom .cursor/agents, parallel and resume.",
  "hooks.json lifecycle scripts, matchers, and RTK proxy.",
  "hooks.json lifecycle scripts: preToolUse, shell, subagent, Tab, and RTK proxy.",
  "AI-first vs augmented, editors, context window, Context7/Ref, and RTK.",
]);

test("every catalog blurb has a Russian translation", () => {
  const blurbs = [
    ...TRACKS.map((track) => track.description),
    ...SUBJECTS.flatMap((subject) => [
      subject.blurb,
      ...subject.clusters.map((cluster) => cluster.blurb),
    ]),
    ...TOPICS.map((topic) => topic.blurb),
  ];
  for (const english of new Set(blurbs)) {
    if (PENDING_RU_BLURBS.has(english)) {
      continue;
    }
    const localized = catalogBlurb("ru", english);
    assert.notEqual(localized, english, `missing RU blurb for: ${english}`);
  }
});
