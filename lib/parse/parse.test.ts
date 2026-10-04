import assert from "node:assert/strict";
import test from "node:test";
import { collectConceptBlocks, parseTopicOutline } from "./parse";

test("collectConceptBlocks strips duplicate heading after anchor preamble", () => {
  const blocks = collectConceptBlocks(`
<details>
  <summary>Observer</summary>

<a name="observer"></a>

### Observer

**Definition:** One-to-many notification.
</details>
`);

  assert.equal(blocks.length, 1);
  assert.equal(blocks[0].title, "Observer");
  assert.match(blocks[0].body, /<a name="observer"><\/a>/);
  assert.doesNotMatch(blocks[0].body, /^#{1,3}\s+Observer/m);
  assert.match(blocks[0].body, /\*\*Definition:\*\*/);
});

test("collectConceptBlocks keeps non-matching heading after anchor preamble", () => {
  const blocks = collectConceptBlocks(`
<details>
  <summary>Observer</summary>

<a name="observer"></a>

### Implementation notes

**Definition:** One-to-many notification.
</details>
`);

  assert.equal(blocks.length, 1);
  assert.match(blocks[0].body, /### Implementation notes/);
});

test("collectConceptBlocks still strips duplicate heading without anchor preamble", () => {
  const blocks = collectConceptBlocks(`
<details>
  <summary>Factory</summary>

### Factory

**Definition:** Creates objects.
</details>
`);

  assert.equal(blocks.length, 1);
  assert.doesNotMatch(blocks[0].body, /^#{1,3}\s+Factory/m);
});

test("collectConceptBlocks ignores preamble before first horizontal rule", () => {
  const blocks = collectConceptBlocks(`
# Data Structures — hub

### Navigation

| Topic | Covers |
| --- | --- |
| [Linear](./7_special_data_structures_linear.md) | Arrays. |

---

<details>
  <summary>Choosing a data structure</summary>

### Choosing a data structure

**Definition:** Lookup table.
</details>
`);

  assert.equal(blocks.length, 1);
  assert.equal(blocks[0].title, "Choosing a data structure");
});

test("collectConceptBlocks keeps short interview task bodies", () => {
  const blocks = collectConceptBlocks(`
## Coding tasks

<details>
<summary>Task 1 — Short prompt</summary>

Implement \`Pick\` without the built-in utility.
</details>
`);

  assert.equal(blocks.length, 1);
  assert.equal(blocks[0].title, "Task 1 — Short prompt");
});

test("interview topic headings group the following questions", () => {
  const outline = parseTopicOutline(`
## Interview Practice

### HTML Basics

<details>
<summary>What does HTML stand for?</summary>

### What does HTML stand for?

**Definition:**

</details>

### Lists

<details>
<summary>What types of lists exist?</summary>

### What types of lists exist?

**Definition:**

</details>
`);

  assert.deepEqual(
    outline.map((item) => [item.group, item.title]),
    [
      ["HTML Basics", "What does HTML stand for?"],
      ["Lists", "What types of lists exist?"],
    ],
  );
});
