import assert from "node:assert/strict";
import test from "node:test";
import {
  browserDocumentConceptSection,
  withBrowserDocumentConceptGroups,
} from "./browserDocumentHub";

test("browserDocumentConceptSection maps concepts to sections", () => {
  assert.equal(browserDocumentConceptSection("Script loading"), "Environment");
  assert.equal(browserDocumentConceptSection("DOM tree"), "DOM tree");
  assert.equal(
    browserDocumentConceptSection("Element size and scroll"),
    "Size, scroll & coordinates",
  );
  assert.equal(browserDocumentConceptSection("Unknown"), undefined);
});

test("withBrowserDocumentConceptGroups assigns groups in handbook order", () => {
  const items = withBrowserDocumentConceptGroups([
    { title: "Script loading" },
    { title: "DOM navigation" },
    { title: "Coordinates" },
  ]);
  assert.deepEqual(
    items.map((item) => [item.title, item.group ?? null]),
    [
      ["Script loading", "Environment"],
      ["DOM navigation", "DOM tree"],
      ["Coordinates", "Size, scroll & coordinates"],
    ],
  );
});
