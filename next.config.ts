import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["sanitize-html", "marked"],
};

export default nextConfig;
