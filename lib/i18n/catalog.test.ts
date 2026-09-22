import assert from "node:assert/strict";
import test from "node:test";
import { SUBJECTS, TOPICS, TRACKS } from "@/lib/catalog";
import { catalogBlurb } from "./catalog";

test("catalogBlurb returns English unchanged for en", () => {
  assert.equal(
    catalogBlurb("en", "Document skeleton, metadata, elements, and attributes."),
    "Document skeleton, metadata, elements, and attributes.",
  );
});

test("catalogBlurb translates HTML Structure card for ru", () => {
  assert.equal(
    catalogBlurb("ru", "Document skeleton, metadata, elements, and attributes."),
    "Каркас документа, метаданные, элементы и атрибуты.",
  );
});

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
    const localized = catalogBlurb("ru", english);
    assert.notEqual(
      localized,
      english,
      `missing RU blurb for: ${english}`,
    );
  }
});
