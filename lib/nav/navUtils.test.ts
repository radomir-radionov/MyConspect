import assert from "node:assert/strict";
import test from "node:test";
import { isRedundantTopicConceptTitle } from "./navUtils";

test("isRedundantTopicConceptTitle matches exact titles only", () => {
  assert.equal(isRedundantTopicConceptTitle("Event Loop", "Event Loop"), true);
  assert.equal(
    isRedundantTopicConceptTitle("Event Loop", "Event loop overview"),
    false,
  );
  assert.equal(
    isRedundantTopicConceptTitle("SEO", "SEO fundamentals for developers"),
    false,
  );
  assert.equal(isRedundantTopicConceptTitle("Variables", "Variables"), true);
});
