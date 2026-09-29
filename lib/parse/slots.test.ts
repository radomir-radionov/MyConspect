import assert from "node:assert/strict";
import test from "node:test";
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";
import { structureConceptBody } from "./slots";

const SANITIZE: sanitizeHtml.IOptions = {
  allowedTags: [
    ...(sanitizeHtml.defaults.allowedTags ?? []),
    "h4",
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
  ],
};

async function renderFragment(markdown: string): Promise<string> {
  const parsed = marked.parse(markdown, { async: false });
  return sanitizeHtml(parsed, SANITIZE);
}

test("structureConceptBody keeps When to use and When not to use as separate slots", async () => {
  const html = await structureConceptBody(
    `**When to use:**

- Good fit

**When not to use:**

- Poor fit`,
    renderFragment,
  );

  assert.match(html, /When to use<\/span>/);
  assert.match(html, /When not to use<\/span>/);
  assert.equal((html.match(/slot-cases/g) ?? []).length, 1);
  assert.equal((html.match(/slot-avoid/g) ?? []).length, 1);
});

test("structureConceptBody omits See also slots", async () => {
  const html = await structureConceptBody(
    `**Short answer:** Same five OOP principles.

**See also:** [SOLID in React](./4_react_core.md#solid-in-react)`,
    renderFragment,
  );

  assert.match(html, /Short answer/i);
  assert.match(html, /Same five OOP principles/);
  assert.doesNotMatch(html, /See also/i);
  assert.doesNotMatch(html, /SOLID in React/);
});

test("structureConceptBody renders bullet lists in case slots", async () => {
  const html = await structureConceptBody(
    `**When to use:**

- First item
- Second item`,
    renderFragment,
  );

  assert.match(html, /<ul>[\s\S]*<li>[\s\S]*First item/);
});
