import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { handbookNavSections } from "./handbook";
import { enrichNavSections } from "./enrichNav";
import { sectionSwitchHref } from "./sections";

describe("enrichNavSections", () => {
  it("keeps conspect and interview section trees separate", () => {
    const structure = handbookNavSections("en");
    const loaded = new Map([
      [
        "frontend",
        structure.flatMap((section) =>
          section.groups.filter((group) => group.id === "frontend"),
        ),
      ],
    ]);

    const enriched = enrichNavSections(structure, loaded);
    const conspectFrontend = enriched
      .find((section) => section.id === "conspect")
      ?.groups.find((group) => group.id === "frontend");
    const interviewsFrontend = enriched
      .find((section) => section.id === "interviews")
      ?.groups.find((group) => group.id === "frontend");

    assert.ok(conspectFrontend);
    assert.ok(interviewsFrontend);
    assert.notDeepEqual(conspectFrontend.entries, interviewsFrontend.entries);

    assert.equal(
      sectionSwitchHref(enriched, "/en/frontend/html-interview", "conspect"),
      "/en/frontend/html-structure",
    );
    assert.equal(
      sectionSwitchHref(enriched, "/en/frontend/css", "interviews"),
      "/en/frontend/css-interview",
    );
  });
});
