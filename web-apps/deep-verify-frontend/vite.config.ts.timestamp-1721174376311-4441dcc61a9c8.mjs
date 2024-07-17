// vite.config.ts
import { defineConfig } from "file:///C:/Users/Francis/Documents/BIG%20PLAN/Projects/deep-verify-project/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/Francis/Documents/BIG%20PLAN/Projects/deep-verify-project/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { VitePWA } from "file:///C:/Users/Francis/Documents/BIG%20PLAN/Projects/deep-verify-project/node_modules/vite-plugin-pwa/dist/index.js";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: "injectManifest",
      srcDir: "src/custom-sw",
      filename: "my-sw.ts"
    })
  ],
  resolve: {
    alias: {
      "@": "/src"
    }
  }
  // server: {
  //   proxy: {
  //     "/backend": {
  //       target: "https://deep-verify-backend.onrender.com",
  //       changeOrigin: true,
  //     },
  //   },
  // },
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxGcmFuY2lzXFxcXERvY3VtZW50c1xcXFxCSUcgUExBTlxcXFxQcm9qZWN0c1xcXFxkZWVwLXZlcmlmeS1wcm9qZWN0XFxcXHdlYi1hcHBzXFxcXGRlZXAtdmVyaWZ5LWZyb250ZW5kXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxGcmFuY2lzXFxcXERvY3VtZW50c1xcXFxCSUcgUExBTlxcXFxQcm9qZWN0c1xcXFxkZWVwLXZlcmlmeS1wcm9qZWN0XFxcXHdlYi1hcHBzXFxcXGRlZXAtdmVyaWZ5LWZyb250ZW5kXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9GcmFuY2lzL0RvY3VtZW50cy9CSUclMjBQTEFOL1Byb2plY3RzL2RlZXAtdmVyaWZ5LXByb2plY3Qvd2ViLWFwcHMvZGVlcC12ZXJpZnktZnJvbnRlbmQvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xuaW1wb3J0IHsgVml0ZVBXQSB9IGZyb20gXCJ2aXRlLXBsdWdpbi1wd2FcIjtcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCgpLFxuICAgIFZpdGVQV0Eoe1xuICAgICAgc3RyYXRlZ2llczogXCJpbmplY3RNYW5pZmVzdFwiLFxuICAgICAgc3JjRGlyOiBcInNyYy9jdXN0b20tc3dcIixcbiAgICAgIGZpbGVuYW1lOiBcIm15LXN3LnRzXCIsXG4gICAgfSksXG4gIF0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgXCJAXCI6IFwiL3NyY1wiLFxuICAgIH0sXG4gIH0sXG4gIC8vIHNlcnZlcjoge1xuICAvLyAgIHByb3h5OiB7XG4gIC8vICAgICBcIi9iYWNrZW5kXCI6IHtcbiAgLy8gICAgICAgdGFyZ2V0OiBcImh0dHBzOi8vZGVlcC12ZXJpZnktYmFja2VuZC5vbnJlbmRlci5jb21cIixcbiAgLy8gICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAvLyAgICAgfSxcbiAgLy8gICB9LFxuICAvLyB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWdlLFNBQVMsb0JBQW9CO0FBQzdmLE9BQU8sV0FBVztBQUNsQixTQUFTLGVBQWU7QUFHeEIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sUUFBUTtBQUFBLE1BQ04sWUFBWTtBQUFBLE1BQ1osUUFBUTtBQUFBLE1BQ1IsVUFBVTtBQUFBLElBQ1osQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUs7QUFBQSxJQUNQO0FBQUEsRUFDRjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFTRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
