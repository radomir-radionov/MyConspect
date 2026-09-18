import assert from "node:assert/strict";
import test from "node:test";
import type { NavGroup } from "@/lib/nav";
import { crumbsForPath } from "./location";

const labels = { home: "Home", instructions: "Instructions" };

const groups: readonly NavGroup[] = [
  {
    id: "backend",
    title: "Backend",
    href: "/backend",
    entries: [
      {
        kind: "subject",
        subject: {
          slug: "nodejs",
          href: "/backend/nodejs",
          title: "Node.js",
          blurb: "",
          clusters: [
            {
              id: "core",
              title: "Core",
              href: "/backend/nodejs#core",
              topics: [
                {
                  slug: "nodejs-runtime",
                  href: "/backend/nodejs-runtime",
                  title: "Runtime",
                  blurb: "",
                  concepts: [],
                },
              ],
            },
            {
              id: "http",
              title: "HTTP",
              href: "/backend/nodejs#http",
              topics: [
                {
                  slug: "nodejs-http",
                  href: "/backend/nodejs-http",
                  title: "HTTP",
                  blurb: "",
                  concepts: [{ id: "express", title: "Express" }],
                },
              ],
            },
          ],
        },
      },
    ],
  },
  {
    id: "frontend",
    title: "Frontend",
    href: "/frontend",
    entries: [
      {
        kind: "subject",
        subject: {
          slug: "html",
          href: "/frontend/html",
          title: "HTML",
          blurb: "",
          clusters: [
            {
              id: "core",
              title: "Core",
              href: "/frontend/html#core",
              topics: [
                {
                  slug: "html-structure",
                  href: "/frontend/html-structure",
                  title: "Structure",
                  blurb: "",
                  concepts: [],
                },
                {
                  slug: "html-forms",
                  href: "/frontend/html-forms",
                  title: "Forms",
                  blurb: "",
                  concepts: [],
                },
              ],
            },
          ],
        },
      },
    ],
  },
];

function trail(pathname: string, hash = "") {
  return crumbsForPath(groups, pathname, hash, labels).map((item) => item.label);
}

test("Node.js hub does not treat a same-named cluster hash as the current page", () => {
  assert.deepEqual(trail("/backend/nodejs", "#http"), ["Home", "Backend", "Node.js"]);
});

test("HTTP topic does not duplicate the cluster name in the trail", () => {
  assert.deepEqual(trail("/backend/nodejs-http"), ["Home", "Backend", "Node.js", "HTTP"]);
});

test("HTTP topic still appends the open concept", () => {
  assert.deepEqual(trail("/backend/nodejs-http", "#express"), [
    "Home",
    "Backend",
    "Node.js",
    "HTTP",
    "Express",
  ]);
});

test("multi-topic clusters stay in the trail", () => {
  assert.deepEqual(trail("/frontend/html-structure"), [
    "Home",
    "Frontend",
    "HTML",
    "Core",
    "Structure",
  ]);
});

test("a distinct cluster hash on the hub stays in the trail", () => {
  assert.deepEqual(trail("/backend/nodejs", "#core"), ["Home", "Backend", "Node.js", "Core"]);
});
