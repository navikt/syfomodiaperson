import { defineConfig } from "vitest/config";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [svgr({ include: "**/*.svg" })],
  test: {
    globals: true,
    environment: "jsdom",
    include: ["test/**/*{test,Test}.*"],
    setupFiles: ["test/setup.ts"],
    server: {
      deps: {
        inline: ["@navikt/analytics-types"],
      },
    },
    deps: {
      web: {
        transformAssets: false,
        transformCss: false,
      },
    },
  },
});
