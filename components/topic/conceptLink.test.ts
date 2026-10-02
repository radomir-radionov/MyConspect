import assert from "node:assert/strict";
import test from "node:test";
import { conceptShareUrl, pageShareUrl } from "./conceptLink";

test("pageShareUrl builds origin pathname", () => {
  assert.equal(
    pageShareUrl(
      "https://myconspect.vercel.app",
      "/en/system-design/architecture",
    ),
    "https://myconspect.vercel.app/en/system-design/architecture",
  );
});

test("conceptShareUrl builds origin pathname hash", () => {
  assert.equal(
    conceptShareUrl(
      "https://myconspect.vercel.app",
      "/en/frontend/js-core",
      "closures",
    ),
    "https://myconspect.vercel.app/en/frontend/js-core#closures",
  );
});

test("conceptShareUrl encodes special characters in concept id", () => {
  assert.equal(
    conceptShareUrl("http://localhost:3000", "/en/frontend/react", "use state"),
    "http://localhost:3000/en/frontend/react#use%20state",
  );
});
