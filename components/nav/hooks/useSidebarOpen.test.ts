import assert from "node:assert/strict";
import test from "node:test";
import type { NavRootSection } from "@/lib/nav";
import { queueHandbookHref, takePendingHashForPath } from "../utils/hash";
import { sidebarNavLocation } from "./useSidebarOpen";

const sections: readonly NavRootSection[] = [
  {
    id: "interviews",
    title: "Interviews",
    groups: [
      {
        id: "frontend",
        title: "Frontend",
        href: "/en/frontend",
        entries: [],
      },
      {
        id: "backend",
        title: "Backend",
        href: "/en/backend",
        entries: [
          {
            kind: "topic",
            topic: {
              slug: "nodejs-interview",
              href: "/en/backend/nodejs-interview",
              title: "Node.js",
              blurb: "",
              concepts: [],
            },
          },
        ],
      },
    ],
  },
];

test("queued track change ignores the previous track hash", () => {
  queueHandbookHref("/en/backend");
  try {
    const nav = sidebarNavLocation(sections, "/en/frontend", "#interview");
    assert.equal(nav.pathname, "/en/backend");
    assert.equal(nav.hash, "");
    assert.equal(nav.location.clusterKey, null);
  } finally {
    takePendingHashForPath("/en/backend");
  }
});

test("an interview topic does not open a cluster", () => {
  const nav = sidebarNavLocation(sections, "/en/backend/nodejs-interview", "");
  assert.equal(nav.location.clusterKey, null);
});
