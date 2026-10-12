import assert from "node:assert/strict";
import test from "node:test";
import { formatSiteLastUpdated, maxIsoDate } from "./siteLastUpdated";

test("maxIsoDate picks the latest valid day", () => {
  assert.equal(maxIsoDate(["2026-09-17", "2026-09-19", "2026-09-18"]), "2026-09-19");
});

test("maxIsoDate ignores invalid and empty values", () => {
  assert.equal(maxIsoDate([null, "", "nope", "2026-09-18"]), "2026-09-18");
  assert.equal(maxIsoDate([null, undefined, ""]), null);
});

test("formatSiteLastUpdated keeps the calendar day in UTC", () => {
  assert.equal(formatSiteLastUpdated("2026-09-19"), "19 September 2026");
});
