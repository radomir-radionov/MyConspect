import fs from "node:fs";
import path from "node:path";
import type { NextConfig } from "next";
import { resourcesRoot } from "./lib/resourcesRoot";

const catalogProbe = path.join(resourcesRoot(), "en", "1_html_structure.md");
if (!fs.existsSync(catalogProbe)) {
  throw new Error(
    `Missing study notes at ${catalogProbe} (cwd=${process.cwd()}). ` +
      "Vercel CLI uploads omit gitignored files; resources/en/*.md must be in the deploy.",
  );
}

const tracedBuildOnly = [
  "./resources/**/*",
  "./node_modules/shiki/**/*",
  "./node_modules/@shikijs/**/*",
];

const TRACK_SEGMENT =
  "frontend|backend|system-design|algorithms|data-structures|testing|ai|other";

const nextConfig: NextConfig = {
  outputFileTracingExcludes: {
    "/*": tracedBuildOnly,
    "/**": tracedBuildOnly,
  },
  serverExternalPackages: ["sanitize-html", "marked", "shiki"],
  async redirects() {
    return [
      {
        source: "/",
        destination: "/en",
        permanent: false,
      },
      {
        source: "/instructions",
        destination: "/en/instructions",
        permanent: true,
      },
      {
        source: `/:track(${TRACK_SEGMENT})`,
        destination: "/en/:track",
        permanent: true,
      },
      {
        source: `/:track(${TRACK_SEGMENT})/:topic`,
        destination: "/en/:track/:topic",
        permanent: true,
      },
      {
        source: "/other/system-design",
        destination: "/en/system-design",
        permanent: true,
      },
      {
        source: "/other/special",
        destination: "/en/other/computer-science",
        permanent: true,
      },
      {
        source: "/other/paradigms",
        destination: "/en/other/computer-science",
        permanent: true,
      },
      {
        source: "/other/special-paradigms",
        destination: "/en/other/computer-science",
        permanent: true,
      },
      {
        source: "/other/ai",
        destination: "/en/ai",
        permanent: true,
      },
      {
        source: "/other/special-testing",
        destination: "/en/testing",
        permanent: true,
      },
      {
        source: "/data-structures/data-structures-choosing",
        destination: "/en/data-structures#choosing-a-data-structure",
        permanent: true,
      },
      {
        source: "/data-structures/data-structures-overview",
        destination: "/en/data-structures#choosing-a-data-structure",
        permanent: true,
      },
      {
        source: "/solid",
        destination: "/en/system-design/solid",
        permanent: true,
      },
      {
        source: "/other/special-engineering",
        destination: "/en/system-design/solid",
        permanent: true,
      },
      {
        source: "/other/special-architecture",
        destination: "/en/system-design/special-architecture",
        permanent: true,
      },
      {
        source: "/other/git-fundamentals",
        destination: "/en/other/git-core",
        permanent: true,
      },
      {
        source: "/frontend/css-fundamentals",
        destination: "/en/frontend/css-core",
        permanent: true,
      },
      {
        source: "/:locale(en|ru)/frontend/react-native",
        destination: "/:locale/frontend/react-native-interview",
        permanent: true,
      },
      {
        source: "/frontend/react-native",
        destination: "/en/frontend/react-native-interview",
        permanent: true,
      },
      {
        source: "/:locale(en|ru)/backend/go",
        destination: "/:locale/backend/go-interview",
        permanent: true,
      },
      {
        source: "/backend/go",
        destination: "/en/backend/go-interview",
        permanent: true,
      },
      {
        source: "/:locale(en|ru)/backend/scala",
        destination: "/:locale/backend/scala-interview",
        permanent: true,
      },
      {
        source: "/backend/scala",
        destination: "/en/backend/scala-interview",
        permanent: true,
      },
      {
        source: "/:locale(en|ru)/backend/redis",
        destination: "/:locale/backend/redis-interview",
        permanent: true,
      },
      {
        source: "/backend/redis",
        destination: "/en/backend/redis-interview",
        permanent: true,
      },
      {
        source: "/system-design/sd-foundations",
        destination: "/en/system-design/sd-core",
        permanent: true,
      },
      {
        source: "/system-design/sd-patterns",
        destination: "/en/system-design/special-patterns",
        permanent: true,
      },
      {
        source: "/backend/nodejs-runtime",
        destination: "/en/backend/nodejs-core",
        permanent: true,
      },
      {
        source: "/backend/nodejs-process",
        destination: "/en/backend/nodejs-additional",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
