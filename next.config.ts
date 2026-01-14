import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Only use static export and basePath for GitHub Pages deployment
  ...(isGitHubPages && {
    output: "export",
    basePath: "/sawa",
  }),
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
