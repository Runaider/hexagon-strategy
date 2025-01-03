import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";
// console.log("path", path.resolve(__dirname, "./src/components/*"));
// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // "@server": path.resolve(__dirname, "../server/src"),
      "@/components/*": path.resolve(__dirname, "./src/components/*"),
      "@/pages/*": path.resolve(__dirname, "./src/pages/*"),
      // "@/app/*": ["app/*"],
      "@/utils/*": path.resolve(__dirname, "./src/utils/*"),
      "@/contexts/*": path.resolve(__dirname, "./src/lib/*"),
      "@/models/*": path.resolve(__dirname, "./src/models/*"),
      "@/hooks/*": path.resolve(__dirname, "./src/hooks/*"),
    },
  },
  plugins: [
    react(),
    VitePWA(),
    // VitePWA({
    //   registerType: "autoUpdate",
    //   workbox: {
    //     runtimeCaching: [
    //       {
    //         urlPattern: /.*\.(?:png|jpg|jpeg|svg|gif)/,
    //         handler: "CacheFirst",
    //         options: {
    //           cacheName: "image-cache",
    //           expiration: {
    //             maxEntries: 50,
    //             maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
    //           },
    //         },
    //       },
    //       {
    //         urlPattern: ({ request }) => request.destination === "image",
    //         handler: "CacheFirst",
    //         options: {
    //           cacheName: "image-cache",
    //           expiration: {
    //             maxEntries: 50,
    //             maxAgeSeconds: 30 * 24 * 60 * 60, // Cache for 30 days
    //           },
    //         },
    //       },
    //     ],
    //   },
    // }),
  ],
});
