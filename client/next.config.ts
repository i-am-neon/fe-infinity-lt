import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // We need Electron to serve dynamic routes
  distDir: "out",
  // Required for Electron static file serving
  images: {
    unoptimized: true,
  },
  // Configure for static usage in Electron
  experimental: {
    appDocumentPreloading: false,
  },
};

export default nextConfig;