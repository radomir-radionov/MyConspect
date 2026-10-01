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
                  slug: "nodejs-core",
                  href: "/backend/nodejs-core",
                  title: "Core",
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
      {
        kind: "subject",
        subject: {
          slug: "javascript",
          href: "/frontend/javascript",
          title: "JavaScript",
          blurb: "",
          clusters: [
            {
              id: "async",
              title: "Async",
              href: "/frontend/javascript#async",
              topics: [
                {
                  slug: "js-async",
                  href: "/frontend/js-async",
                  title: "Async",
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
  return crumbsForPath(groups, pathname, hash, labels).map(
    (item) => item.label,
  );
}

test("Node.js hub does not treat a same-named cluster hash as the current page", () => {
  assert.deepEqual(trail("/backend/nodejs", "#http"), [
    "Home",
    "Backend",
    "Node.js",
  ]);
});

test("Core cluster hash on the hub does not nest under Core", () => {
  assert.deepEqual(trail("/backend/nodejs", "#core"), [
    "Home",
    "Backend",
    "Node.js",
  ]);
});

test("HTTP topic does not duplicate the cluster name in the trail", () => {
  assert.deepEqual(trail("/backend/nodejs-http"), [
    "Home",
    "Backend",
    "Node.js",
    "HTTP",
  ]);
});

test("Core topic does not duplicate the cluster name in the trail", () => {
  assert.deepEqual(trail("/backend/nodejs-core"), [
    "Home",
    "Backend",
    "Node.js",
    "Core",
  ]);
});

test("Additional topic does not duplicate the cluster name in the trail", () => {
  const withAdditional: typeof groups = [
    {
      ...groups[0],
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
                id: "additional",
                title: "Additional",
                href: "/backend/nodejs#additional",
                topics: [
                  {
                    slug: "nodejs-additional",
                    href: "/backend/nodejs-additional",
                    title: "Additional",
                    blurb: "",
                    concepts: [{ id: "child-process", title: "child_process" }],
                  },
                ],
              },
            ],
          },
        },
      ],
    },
    ...groups.slice(1),
  ];
  const labels = { home: "Home", instructions: "Instructions" };
  const trailAdditional = (pathname: string, hash = "") =>
    crumbsForPath(withAdditional, pathname, hash, labels).map(
      (item) => item.label,
    );
  assert.deepEqual(trailAdditional("/backend/nodejs-additional"), [
    "Home",
    "Backend",
    "Node.js",
    "Additional",
  ]);
  assert.deepEqual(
    trailAdditional("/backend/nodejs-additional", "#child-process"),
    ["Home", "Backend", "Node.js", "Additional", "child_process"],
  );
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

test("JavaScript Async does not nest under Additional", () => {
  assert.deepEqual(trail("/frontend/js-async"), [
    "Home",
    "Frontend",
    "JavaScript",
    "Async",
  ]);
});

test("isHomePath matches locale home routes only", async () => {
  const { isHomePath } = await import("./location");
  assert.equal(isHomePath("/en"), true);
  assert.equal(isHomePath("/ru"), true);
  assert.equal(isHomePath("/en/frontend"), false);
  assert.equal(isHomePath("/en/instructions"), false);
});
