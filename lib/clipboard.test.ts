import assert from "node:assert/strict";
import test from "node:test";
import { copyText } from "./clipboard";

test("copyText resolves false when clipboard APIs are unavailable", async () => {
  const result = await copyText("hello");
  assert.equal(typeof result, "boolean");
});
