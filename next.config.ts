import fs from "node:fs";
import path from "node:path";
import type { NextConfig } from "next";

const resourcesDir = path.join(process.cwd(), "resources");
const catalogProbe = path.join(resourcesDir, "1_html_structure.md");
if (!fs.existsSync(catalogProbe)) {
  throw new Error(
    `Missing study notes at ${catalogProbe} (cwd=${process.cwd()}). ` +
      "Vercel CLI uploads omit gitignored files; resources/*.md must be in the deploy.",
  );
}

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/*": ["./resources/**/*.md"],
    "/**": ["./resources/**/*.md"],
  },
  serverExternalPackages: ["sanitize-html", "marked", "shiki"],
  async redirects() {
    return [
      {
        source: "/other/system-design",
        destination: "/system-design",
        permanent: true,
      },
      {
        source: "/other/special",
        destination: "/other/paradigms",
        permanent: true,
      },
      {
        source: "/other/ai",
        destination: "/ai",
        permanent: true,
      },
      {
        source: "/algorithms/algorithms-data",
        destination: "/data-structures",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
