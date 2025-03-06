import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // We need Electron to serve dynamic routes
  // Removed output: "export" setting
  distDir: "out",
  // Required for Electron static file serving
  images: {
    unoptimized: true,
  },
};

export default nextConfig;