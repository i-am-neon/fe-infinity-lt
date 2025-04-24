import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  base: "", // Empty string for both relative paths and properly resolving from the root in production
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Ensure public directory is properly copied to the output
  publicDir: path.resolve(__dirname, "public"),
  build: {
    // Output assets with content hashes to allow for long-term caching
    assetsDir: "assets",
    // Ensure Electron can access the bundled files
    emptyOutDir: true,
    rollupOptions: {
      // Preserve the directory structure of assets
      output: {
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },
  },
});
