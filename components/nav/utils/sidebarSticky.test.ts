import assert from "node:assert/strict";
import test from "node:test";
import {
  measureNavChromeInset,
  resolveStickyTopPx,
  shouldReleaseStickyScope,
  stickyVarsEqual,
  writeStickyVars,
} from "./sidebarSticky";

test("measureNavChromeInset returns 0 when chrome is missing", () => {
  assert.equal(measureNavChromeInset(null), 0);
});

test("shouldReleaseStickyScope is true when the next track reaches the stack", () => {
  assert.equal(shouldReleaseStickyScope(270, 277), true);
  assert.equal(shouldReleaseStickyScope(225, 225), true);
  assert.equal(shouldReleaseStickyScope(280, 277), false);
});

test("stickyVarsEqual is true for the same keys and values", () => {
  assert.equal(
    stickyVarsEqual(
      { "--nav-sticky-cover": "12px" },
      { "--nav-sticky-cover": "12px" },
    ),
    true,
  );
});

test("stickyVarsEqual is false when a value differs", () => {
  assert.equal(
    stickyVarsEqual(
      { "--nav-sticky-cover": "12px" },
      { "--nav-sticky-cover": "13px" },
    ),
    false,
  );
});

test("resolveStickyTopPx prefers measured vars over scroller styles", () => {
  const scrollerStyle = {
    getPropertyValue(name: string) {
      return name === "--nav-sticky-top-subject" ? "99px" : "";
    },
  };
  assert.equal(
    resolveStickyTopPx(
      "--nav-sticky-top-subject",
      { "--nav-sticky-top-subject": "42px" },
      scrollerStyle,
    ),
    42,
  );
});

test("resolveStickyTopPx reads sticky tops from the scroller when vars are absent", () => {
  const scrollerStyle = {
    getPropertyValue(name: string) {
      return name === "--nav-sticky-top-cluster" ? "88px" : "";
    },
  };
  assert.equal(
    resolveStickyTopPx("--nav-sticky-top-cluster", undefined, scrollerStyle),
    88,
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
  writeStickyVars(
    style,
    { "--nav-sticky-cover": "12px" },
    { "--nav-sticky-cover": "12px" },
  );
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
  writeStickyVars(
    style,
    { "--nav-sticky-cover": "12px" },
    { "--nav-sticky-cover": "12px" },
  );
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
