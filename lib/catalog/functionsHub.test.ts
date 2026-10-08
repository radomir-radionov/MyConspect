import assert from "node:assert/strict";
import test from "node:test";
import {
  functionsConceptSection,
  withFunctionsConceptGroups,
} from "./functionsHub";

test("functionsConceptSection maps child concepts to parent section", () => {
  assert.equal(functionsConceptSection("Inference"), "Generic Functions");
  assert.equal(functionsConceptSection("void"), "Other Types to Know About");
  assert.equal(functionsConceptSection("Function Type Expressions"), undefined);
});

test("withFunctionsConceptGroups assigns group in handbook order", () => {
  const items = withFunctionsConceptGroups([
    { title: "Call Signatures" },
    { title: "Inference" },
    { title: "Optional Parameters in Callbacks" },
  ]);
  assert.deepEqual(
    items.map((item) => [item.title, item.group ?? null]),
    [
      ["Call Signatures", null],
      ["Inference", "Generic Functions"],
      ["Optional Parameters in Callbacks", "Optional Parameters"],
    ],
  );
});
