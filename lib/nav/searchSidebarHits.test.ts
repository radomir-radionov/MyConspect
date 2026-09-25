import assert from "node:assert/strict";
import test from "node:test";
import { collectGroupSearchHits } from "./searchSidebarHits";
import type { NavGroup } from "./types";

const frontendGroup: NavGroup = {
  id: "frontend",
  title: "Frontend",
  href: "/en/frontend",
  entries: [
    {
      kind: "subject",
      subject: {
        slug: "javascript",
        href: "/en/frontend/javascript",
        title: "JavaScript",
        blurb: "",
        clusters: [
          {
            id: "core",
            title: "Core",
            href: "/en/frontend/javascript#core",
            topics: [
              {
                slug: "js-language",
                href: "/en/frontend/js-language",
                title: "Language",
                blurb: "",
                concepts: [
                  { id: "solid-classes", title: "SOLID in Classes" },
                  { id: "solid-functions", title: "SOLID in Functions" },
                ],
              },
            ],
          },
        ],
      },
    },
    {
      kind: "subject",
      subject: {
        slug: "react",
        href: "/en/frontend/react",
        title: "React",
        blurb: "",
        clusters: [
          {
            id: "core",
            title: "Core",
            href: "/en/frontend/react#core",
            topics: [
              {
                slug: "react-basics",
                href: "/en/frontend/react-basics",
                title: "Basics",
                blurb: "",
                concepts: [{ id: "solid-react", title: "SOLID in React" }],
              },
            ],
          },
        ],
      },
    },
  ],
};

test("collectGroupSearchHits returns a flat list of matching concepts", () => {
  const hits = collectGroupSearchHits(frontendGroup, "solid", "titles");
  assert.equal(hits.length, 3);
  assert.deepEqual(
    hits.map((hit) => hit.concept.title),
    ["SOLID in Classes", "SOLID in Functions", "SOLID in React"],
  );
  assert.equal(hits[0]?.concept.title, "SOLID in Classes");
  assert.equal(hits[2]?.concept.title, "SOLID in React");
});
