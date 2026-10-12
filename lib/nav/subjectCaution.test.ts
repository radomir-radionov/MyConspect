import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { subjectCautionTooltip, subjectHasCaution } from "./subjectCaution";

describe("subjectCaution", () => {
  it("flags vue-nuxt only", () => {
    assert.equal(subjectHasCaution("vue-nuxt"), true);
    assert.equal(subjectHasCaution("vue"), false);
    assert.equal(subjectHasCaution("react"), false);
  });

  it("returns localized tooltips", () => {
    assert.match(
      subjectCautionTooltip("en", "vue-nuxt") ?? "",
      /notes here may be wrong/i,
    );
    assert.match(
      subjectCautionTooltip("ru", "vue-nuxt") ?? "",
      /заметки здесь могут быть неточными/i,
    );
    assert.equal(subjectCautionTooltip("en", "react"), undefined);
  });
});
