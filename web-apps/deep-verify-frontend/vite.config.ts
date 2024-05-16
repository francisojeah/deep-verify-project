import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
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
  server: {
    proxy: {
      "/backend": {
        target: "https://deep-verify-backend.onrender.com",
        changeOrigin: true,
      },
    },
  },
});
