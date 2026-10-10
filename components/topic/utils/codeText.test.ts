import assert from "node:assert/strict";
import test from "node:test";
import { preTextContent } from "./codeText";

test("preTextContent trims text from pre element markup", () => {
  const pre = {
    textContent: "  const x = 1;\n",
  } as HTMLElement;
  assert.equal(preTextContent(pre), "const x = 1;");
});
