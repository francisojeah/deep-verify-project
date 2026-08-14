import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  // GitHub Pages serves a project site from a subpath; Vercel and local serve from root.
  base: process.env.VITE_BASE_PATH ?? "/",
  plugins: [
    react(),
    VitePWA({
      strategies: "injectManifest",
      srcDir: "src/custom-sw",
      filename: "my-sw.ts",
    }),
  ],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  // server: {
  //   proxy: {
  //     "/backend": {
  //       target: "https://deep-verify-backend.onrender.com",
  //       changeOrigin: true,
  //     },
  //   },
  // },
});
