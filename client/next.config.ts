import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // We need Electron to serve dynamic routes
  output: "export",
  distDir: "out",
  // Required for Electron static file serving
  images: {
    unoptimized: true,
  },
};

export default nextConfig;