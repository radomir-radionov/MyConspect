import assert from "node:assert/strict";
import test from "node:test";
import { collectConceptBlocks } from "./parse";

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
