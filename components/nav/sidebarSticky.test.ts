import assert from "node:assert/strict";
import test from "node:test";
import { stickyVarsEqual, writeStickyVars } from "./sidebarSticky";

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

test("writeStickyVars skips DOM writes when the style already matches", () => {
  const writes: string[] = [];
  const props: Record<string, string> = { "--nav-sticky-cover": "12px" };
  const style = {
    getPropertyValue(name: string) {
      return props[name] ?? "";
    },
    setProperty(name: string, value: string) {
      writes.push(`set:${name}=${value}`);
      props[name] = value;
    },
    removeProperty(name: string) {
      writes.push(`remove:${name}`);
      delete props[name];
      return "";
    },
  };
  writeStickyVars(style, { "--nav-sticky-cover": "12px" }, { "--nav-sticky-cover": "12px" });
  assert.deepEqual(writes, []);
});

test("writeStickyVars rewrites after the style was cleared", () => {
  const writes: string[] = [];
  const props: Record<string, string> = {};
  const style = {
    getPropertyValue(name: string) {
      return props[name] ?? "";
    },
    setProperty(name: string, value: string) {
      writes.push(`set:${name}=${value}`);
      props[name] = value;
    },
    removeProperty(name: string) {
      writes.push(`remove:${name}`);
      delete props[name];
      return "";
    },
  };
  writeStickyVars(style, { "--nav-sticky-cover": "12px" }, { "--nav-sticky-cover": "12px" });
  assert.deepEqual(writes, ["set:--nav-sticky-cover=12px"]);
});

test("writeStickyVars updates only changed keys", () => {
  const writes: string[] = [];
  const props: Record<string, string> = {
    "--nav-sticky-cover": "12px",
    "--nav-sticky-top-subject": "36px",
  };
  const style = {
    getPropertyValue(name: string) {
      return props[name] ?? "";
    },
    setProperty(name: string, value: string) {
      writes.push(`set:${name}=${value}`);
      props[name] = value;
    },
    removeProperty(name: string) {
      writes.push(`remove:${name}`);
      delete props[name];
      return "";
    },
  };
  const next = writeStickyVars(
    style,
    { "--nav-sticky-cover": "20px", "--nav-sticky-top-track": "8px" },
    { "--nav-sticky-cover": "12px", "--nav-sticky-top-subject": "36px" },
  );
  assert.deepEqual(writes, [
    "remove:--nav-sticky-top-subject",
    "set:--nav-sticky-cover=20px",
    "set:--nav-sticky-top-track=8px",
  ]);
  assert.equal(next["--nav-sticky-cover"], "20px");
});
