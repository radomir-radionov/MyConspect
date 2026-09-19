import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { withoutSearchText } from "./chromeNav";
import type { NavGroup } from "./types";

describe("withoutSearchText", () => {
  it("drops concept bodies used only for notes search", () => {
    const groups: readonly NavGroup[] = [
      {
        id: "frontend",
        title: "Frontend",
        href: "/frontend",
        entries: [
          {
            kind: "topic",
            topic: {
              slug: "js-core",
              href: "/frontend/js-core",
              title: "Core",
              blurb: "Language",
              concepts: [
                {
                  id: "event-loop",
                  title: "Event loop",
                  searchText: "the event loop queues tasks",
                  titleSearchText: "event loop",
                },
              ],
            },
          },
        ],
      },
    ];

    const chrome = withoutSearchText(groups);
    const concept = chrome[0]?.entries[0];
    assert.ok(concept && concept.kind === "topic");
    assert.equal(concept.topic.concepts[0]?.title, "Event loop");
    assert.equal(concept.topic.concepts[0]?.searchText, undefined);
    assert.equal(concept.topic.concepts[0]?.titleSearchText, "event loop");
  });
});
