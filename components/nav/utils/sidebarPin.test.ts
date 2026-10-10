import assert from "node:assert/strict";
import test from "node:test";
import { shouldResetNavAsideScroll } from "./sidebarPin";

test("shouldResetNavAsideScroll is false for sibling topics in one track", () => {
  assert.equal(
    shouldResetNavAsideScroll(
      "/en/frontend/ts-iterators",
      "/en/frontend/ts-symbols",
    ),
    false,
  );
  assert.equal(
    shouldResetNavAsideScroll(
      "/en/frontend/html-structure",
      "/en/frontend/html-forms",
    ),
    false,
  );
});

test("shouldResetNavAsideScroll is true when the track changes", () => {
  assert.equal(
    shouldResetNavAsideScroll("/en/frontend/ts-iterators", "/en/backend"),
    true,
  );
  assert.equal(
    shouldResetNavAsideScroll("/en/frontend/typescript", "/en/system-design"),
    true,
  );
});
