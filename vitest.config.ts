import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    environment: "jsdom",
    include: ["test/**/*{test,Test}.*"],
    setupFiles: ["test/setup.ts"],
    pool: "forks",
    poolOptions: {
      forks: {
        maxForks: 2,
        minForks: 1,
        execArgv: ["--max-old-space-size=3072"],
      },
    },
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
