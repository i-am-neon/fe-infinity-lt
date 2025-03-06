import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  distDir: "out",
  // Required for Electron static file serving
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
