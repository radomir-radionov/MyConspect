import assert from "node:assert/strict";
import test from "node:test";
import type { NavGroup } from "@/lib/nav";
import {
  adjacentConceptId,
  crumbsForPath,
  navChainForPath,
  navChainIndex,
  parentHrefForPath,
  siblingNavHrefForPath,
} from "./location";

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

const leafTrackGroup: NavGroup = {
  id: "behavior",
  title: "Behavior questions",
  href: "/behavior",
  entries: [],
  leafTopic: {
    slug: "behavior-questions",
    href: "/behavior",
    title: "Behavior questions",
    blurb: "",
    concepts: [
      { id: "prep", title: "Interview preparation" },
      { id: "tell-me", title: "Tell me about yourself" },
    ],
  },
};

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

test("leaf track hub skips duplicate topic index in nav chain", () => {
  const chain = navChainForPath([leafTrackGroup], "/behavior", "");
  assert.deepEqual(
    chain?.map((step) =>
      step.hash ? `${step.pathname}#${step.hash}` : step.pathname,
    ),
    ["/behavior", "/behavior#prep", "/behavior#tell-me"],
  );
});

test("leaf track next from hub opens the first concept", () => {
  assert.equal(
    siblingNavHrefForPath([leafTrackGroup], "/behavior", "", 1, "/en"),
    "/behavior#prep",
  );
});

test("leaf track next from last concept wraps to the first concept", () => {
  assert.equal(
    siblingNavHrefForPath([leafTrackGroup], "/behavior", "#tell-me", 1, "/en"),
    "/behavior#prep",
  );
});

test("navChainForPath scopes topic siblings within a cluster", () => {
  const chain = navChainForPath(groups, "/backend/nodejs-core", "");
  assert.ok(chain);
  assert.equal(chain?.[0]?.pathname, "/backend/nodejs-core");
  assert.equal(chain?.length, 1);
});

test("navChainForPath includes the cluster hub for multi-topic clusters", () => {
  const chain = navChainForPath(groups, "/frontend/html-structure", "");
  assert.ok(chain);
  assert.deepEqual(
    chain?.map((step) =>
      step.hash ? `${step.pathname}#${step.hash}` : step.pathname,
    ),
    ["/frontend/html#core", "/frontend/html-structure", "/frontend/html-forms"],
  );
});

test("siblingNavHrefForPath moves within the scoped cluster and wraps next at the end", () => {
  const home = "/en";
  assert.equal(
    siblingNavHrefForPath(groups, "/backend/nodejs-core", "", -1, home),
    null,
  );
  assert.equal(
    siblingNavHrefForPath(groups, "/backend/nodejs-core", "", 1, home),
    null,
  );
  assert.equal(
    siblingNavHrefForPath(groups, "/backend/nodejs-http", "", -1, home),
    null,
  );
  assert.equal(
    siblingNavHrefForPath(groups, "/backend/nodejs-http", "", 1, home),
    null,
  );
  assert.equal(
    siblingNavHrefForPath(groups, "/frontend/html-structure", "", 1, home),
    "/frontend/html-forms",
  );
  assert.equal(
    siblingNavHrefForPath(groups, "/frontend/html-forms", "", 1, home),
    "/frontend/html#core",
  );
});

test("last concept in a topic returns to the topic list before leaving the cluster", () => {
  const home = "/en";
  const databaseGroups: readonly NavGroup[] = [
    {
      id: "backend",
      title: "Backend",
      href: "/backend",
      entries: [
        {
          kind: "subject",
          subject: {
            slug: "database",
            href: "/backend/database",
            title: "Database",
            blurb: "",
            clusters: [
              {
                id: "core",
                title: "Core",
                href: "/backend/database#core",
                topics: [
                  {
                    slug: "foundations",
                    href: "/backend/database-foundations",
                    title: "Foundations",
                    blurb: "",
                    concepts: [],
                  },
                  {
                    slug: "sql",
                    href: "/backend/database-sql",
                    title: "SQL",
                    blurb: "",
                    concepts: [
                      { id: "indexes", title: "Indexes" },
                      { id: "postgres", title: "PostgreSQL" },
                    ],
                  },
                ],
              },
              {
                id: "nosql",
                title: "NoSQL",
                href: "/backend/database#nosql",
                topics: [
                  {
                    slug: "nosql-core",
                    href: "/backend/database-nosql-core",
                    title: "NoSQL Core",
                    blurb: "",
                    concepts: [
                      { id: "overview", title: "Overview" },
                      { id: "types", title: "Types" },
                    ],
                  },
                ],
              },
            ],
          },
        },
      ],
    },
  ];

  assert.equal(
    siblingNavHrefForPath(
      databaseGroups,
      "/backend/database-sql",
      "#postgres",
      1,
      home,
    ),
    "/backend/database-sql",
  );
});

test("navChainIndex matches pathname and concept hash", () => {
  const chain = navChainForPath(groups, "/backend/nodejs-http", "#express");
  assert.ok(chain);
  assert.equal(
    navChainIndex(chain ?? [], "/backend/nodejs-http", "#express"),
    chain?.findIndex((step) => step.hash === "express"),
  );
});

test("adjacentConceptId returns the next and previous concept id", () => {
  const ids = ["alpha", "beta", "gamma"];
  assert.equal(adjacentConceptId(ids, "beta", 1), "gamma");
  assert.equal(adjacentConceptId(ids, "beta", -1), "alpha");
  assert.equal(adjacentConceptId(ids, "gamma", 1), null);
});

test("parentHrefForPath returns the nearest linked ancestor", () => {
  assert.equal(
    parentHrefForPath(groups, "/backend/nodejs-core", "", labels),
    "/backend/nodejs",
  );
  assert.equal(
    parentHrefForPath(groups, "/backend/nodejs-http", "", labels),
    "/backend/nodejs",
  );
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

test("bookmarkMatchesPage matches topic and concept bookmarks", async () => {
  const { bookmarkMatchesPage } = await import("@/lib/nav/bookmarks");
  const topic = "/en/backend/nodejs-core";

  assert.equal(bookmarkMatchesPage(topic, "", topic), true);
  assert.equal(
    bookmarkMatchesPage(topic, "event-loop", topic, "event-loop"),
    true,
  );
  assert.equal(
    bookmarkMatchesPage(topic, "global-object", `${topic}#event-loop`),
    false,
  );
  assert.equal(
    bookmarkMatchesPage(topic, "event-loop", `${topic}#event-loop`),
    true,
  );
});
