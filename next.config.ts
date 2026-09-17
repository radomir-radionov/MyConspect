import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
    ];
  },
};

export default nextConfig;
