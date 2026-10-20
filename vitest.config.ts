import { defineConfig } from "vitest/config";
import svgr from "vite-plugin-svgr";
import path from "path";

// Locks the timezone so date tests behave the same locally and in CI.
process.env.TZ = "Europe/Oslo";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  envDir: path.resolve(__dirname, "test"),
  plugins: [svgr({ include: "**/*.svg" })],
  test: {
    globals: true,
    environment: "jsdom",
    include: ["test/**/*{test,Test}.*"],
    setupFiles: ["test/setup.ts"],
    deps: {
      web: {
        transformAssets: false,
        transformCss: false,
      },
    },
    onConsoleLog(log) {
      // Fixes noisy warnings from Accordion in @navikt/ds-react
      if (
        log.includes(
          "Do not put multiple accordions directly after each other.",
        ) ||
        log.includes("Accordions should have more than one item.")
      ) {
        return false;
      }
    },
  },
});
