import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import svgr from "vite-plugin-svgr";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  server: {
    port: 3000,
    headers: {
      "Service-Worker-Allowed": "/",
    },
  },
  build: {
    outDir: "./dist",
    sourcemap: true,
  },
  base: "/",
  plugins: [react(), svgr({ include: "**/*.svg" }), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
