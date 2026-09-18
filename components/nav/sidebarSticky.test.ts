import assert from "node:assert/strict";
import test from "node:test";
import { stickyVarsEqual } from "./sidebarSticky";

test("stickyVarsEqual is true for the same keys and values", () => {
  assert.equal(
    stickyVarsEqual({ "--nav-sticky-cover": "12px" }, { "--nav-sticky-cover": "12px" }),
    true,
  );
});

test("stickyVarsEqual is false when a value differs", () => {
  assert.equal(
    stickyVarsEqual({ "--nav-sticky-cover": "12px" }, { "--nav-sticky-cover": "13px" }),
    false,
  );
});
