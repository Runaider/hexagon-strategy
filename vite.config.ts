import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
console.log("path", path.resolve(__dirname, "./src/components/*"));
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
  plugins: [react()],
});
