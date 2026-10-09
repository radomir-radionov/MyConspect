import assert from "node:assert/strict";
import test from "node:test";
import { eventsConceptSection, withEventsConceptGroups } from "./eventsHub";

test("eventsConceptSection maps concepts to sections", () => {
  assert.equal(
    eventsConceptSection("Introduction to browser events"),
    "Event basics",
  );
  assert.equal(eventsConceptSection("Pointer events"), "UI events");
  assert.equal(eventsConceptSection("Form submit"), "Forms");
  assert.equal(
    eventsConceptSection("Page lifecycle events"),
    "Document loading",
  );
});

test("withEventsConceptGroups assigns groups", () => {
  const items = withEventsConceptGroups([
    { title: "Event delegation" },
    { title: "Keyboard events" },
    { title: "Resource onload and onerror" },
  ]);
  assert.deepEqual(
    items.map((item) => [item.title, item.group ?? null]),
    [
      ["Event delegation", "Event basics"],
      ["Keyboard events", "UI events"],
      ["Resource onload and onerror", "Document loading"],
    ],
  );
});
