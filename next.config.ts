import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: "export",
  basePath: "/sawa",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
