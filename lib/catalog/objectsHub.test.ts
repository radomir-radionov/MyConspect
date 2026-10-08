import assert from "node:assert/strict";
import test from "node:test";
import { objectsConceptSection, withObjectsConceptGroups } from "./objectsHub";

test("objectsConceptSection maps modifier concepts", () => {
  assert.equal(
    objectsConceptSection("Optional Properties"),
    "Property Modifiers",
  );
  assert.equal(objectsConceptSection("Index Signatures"), "Property Modifiers");
  assert.equal(objectsConceptSection("Quick Reference"), undefined);
});

test("withObjectsConceptGroups assigns section groups", () => {
  const items = withObjectsConceptGroups([
    { title: "Quick Reference" },
    { title: "Property Modifiers" },
    { title: "Index Signatures" },
    { title: "Generic Object Types" },
    { title: "Tuple Types" },
  ]);
  assert.deepEqual(
    items.map((item) => [item.title, item.group ?? null]),
    [
      ["Quick Reference", null],
      ["Property Modifiers", "Property Modifiers"],
      ["Index Signatures", "Property Modifiers"],
      ["Generic Object Types", "Generic Object Types"],
      ["Tuple Types", "Generic Object Types"],
    ],
  );
});
