import assert from "node:assert/strict";
import test from "node:test";
import { SUBJECTS, subjectClusterCards, trackBrowseCards } from "@/lib/catalog";

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
