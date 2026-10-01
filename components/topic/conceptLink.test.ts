import assert from "node:assert/strict";
import test from "node:test";
import { conceptShareUrl } from "./conceptLink";

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
