import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { handbookNavForTrack } from "@/lib/nav/handbook";
import { locationForPath } from "./active";

describe("locationForPath", () => {
  it("treats #utility-types on the TypeScript hub as the section, not the catalog cluster", () => {
    const groups = handbookNavForTrack("en", "frontend");
    const subjectHref = "/en/frontend/typescript";
    const location = locationForPath(groups, subjectHref, "#utility-types");
    assert.equal(location.sectionKey, `${subjectHref}#utility-types`);
    assert.equal(location.clusterKey, null);
    assert.equal(location.topicHref, null);
  });
});
