import assert from "node:assert/strict";
import test from "node:test";
import {
  nextjsA11ySeoConceptSection,
  withNextjsA11ySeoConceptGroups,
} from "./nextjsA11ySeoHub";

test("nextjsA11ySeoConceptSection maps concepts to handbook sections", () => {
  assert.equal(nextjsA11ySeoConceptSection("Static metadata"), "Metadata API");
  assert.equal(nextjsA11ySeoConceptSection("sitemap.ts"), "SEO & discovery");
  assert.equal(nextjsA11ySeoConceptSection("Route announcer"), "Accessibility");
  assert.equal(nextjsA11ySeoConceptSection("Unknown"), undefined);
});

test("withNextjsA11ySeoConceptGroups assigns groups in handbook order", () => {
  const items = withNextjsA11ySeoConceptGroups([
    { title: "generateMetadata" },
    { title: "JSON-LD" },
    { title: "ESLint and jsx-a11y" },
  ]);
  assert.deepEqual(
    items.map((item) => [item.title, item.group ?? null]),
    [
      ["generateMetadata", "Metadata API"],
      ["JSON-LD", "SEO & discovery"],
      ["ESLint and jsx-a11y", "Accessibility"],
    ],
  );
});
