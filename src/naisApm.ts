import { getEnv } from "./environment";
import { init } from "@nais/apm";

init({
  app: "syfomodiaperson",
  namespace: "teamsykefravr",
  environment: getEnv(),
  // Don't check if version is automatically resolved before enabling or removing
  // version: import.meta.env.VITE_RELEASE,
  ignoreErrors: [],
  tracing: true,
  sessionReplay: { enabled: false },
  screenshotOnError: false,
});
