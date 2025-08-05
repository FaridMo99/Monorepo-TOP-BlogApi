import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    exclude: ["@monorepotopblogapi/ui"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      components: path.resolve(__dirname, "../../packages/ui/components"),
    },
  },
});
