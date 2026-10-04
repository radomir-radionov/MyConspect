import assert from "node:assert/strict";
import test from "node:test";
import type { NavGroup } from "@/lib/nav";
import { queueHandbookHref, takePendingHashForPath } from "./hash";
import { sidebarNavLocation } from "./useSidebarOpen";

const groups: readonly NavGroup[] = [
  {
    id: "frontend",
    title: "Frontend",
    href: "/en/frontend",
    entries: [
      {
        kind: "cluster",
        subjectHref: "/en/frontend",
        cluster: {
          id: "interview",
          title: "Interview",
          href: "/en/frontend",
          topics: [],
        },
      },
    ],
  },
  {
    id: "backend",
    title: "Backend",
    href: "/en/backend",
    entries: [
      {
        kind: "cluster",
        subjectHref: "/en/backend",
        cluster: {
          id: "interview",
          title: "Interview",
          href: "/en/backend",
          topics: [
            {
              slug: "nodejs-interview",
              href: "/en/backend/nodejs-interview",
              title: "Node.js",
              blurb: "",
              concepts: [],
            },
          ],
        },
      },
    ],
  },
];

test("queued track change ignores the previous track hash", () => {
  queueHandbookHref("/en/backend");
  try {
    const nav = sidebarNavLocation(groups, "/en/frontend", "#interview");
    assert.equal(nav.pathname, "/en/backend");
    assert.equal(nav.hash, "");
    assert.equal(nav.location.clusterKey, null);
  } finally {
    takePendingHashForPath("/en/backend");
  }
});

test("an interview topic still opens its cluster", () => {
  const nav = sidebarNavLocation(groups, "/en/backend/nodejs-interview", "");
  assert.equal(nav.location.clusterKey, "/en/backend#interview");
});
