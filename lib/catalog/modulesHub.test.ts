import assert from "node:assert/strict";
import test from "node:test";
import { modulesConceptSection, withModulesConceptGroups } from "./modulesHub";

test("modulesConceptSection maps child concepts to parent section", () => {
  assert.equal(
    modulesConceptSection("Non-modules"),
    "How JavaScript Modules are Defined",
  );
  assert.equal(
    modulesConceptSection("ES Module Syntax"),
    "Modules in TypeScript",
  );
  assert.equal(modulesConceptSection("Modules"), undefined);
});

test("withModulesConceptGroups assigns group in handbook order", () => {
  const items = withModulesConceptGroups([
    { title: "Modules" },
    { title: "Non-modules" },
    { title: "CommonJS Syntax" },
  ]);
  assert.deepEqual(
    items.map((item) => [item.title, item.group ?? null]),
    [
      ["Modules", null],
      ["Non-modules", "How JavaScript Modules are Defined"],
      ["CommonJS Syntax", "Modules in TypeScript"],
    ],
  );
});
