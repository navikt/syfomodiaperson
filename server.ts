import express from "express";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import { getToggles } from "./server/unleash.js";
import { validateToken } from "./server/authUtils.js";
import { setupProxy } from "./server/proxy.js";
import { setupDraftEndpoints } from "./server/draft.js";
import { connectValkey } from "./server/valkey.js";
import { logger } from "@navikt/pino-logger";
import { setupCspReporting } from "./server/csp.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = express();

server.use(
  helmet({
    contentSecurityPolicy: {
      reportOnly: true,
      useDefaults: false,
      directives: {
        defaultSrc: ["'self'"],
        baseUri: ["'self'"],
        objectSrc: ["'none'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
        scriptSrc: ["'self'", "https://cdn.nav.no"],
        styleSrc: ["'self'"],
        fontSrc: ["'self'", "https://cdn.nav.no"],
        imgSrc: ["'self'", "data:"],
        connectSrc: [
          "'self'",
          "wss://modiacontextholder.intern.nav.no",
          "wss://modiacontextholder.intern.dev.nav.no",
          "https://telemetry.nav.no",
          "https://telemetry.ekstern.dev.nav.no",
          "https://umami.nav.no",
          "https://reops-event-proxy.nav.no",
          "https://reops-event-proxy.ekstern.dev.nav.no",
        ],
        reportUri: ["/csp-report"],
        reportTo: ["csp-endpoint"],
      },
    },
  }),
);
setupCspReporting(server);
server.use(express.json());

const nocache = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.header("Expires", "-1");
  res.header("Pragma", "no-cache");
  next();
};

const redirectIfUnauthorized = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  if (await validateToken(req)) {
    next();
  } else {
    res.redirect(`/oauth2/login?redirect=${req.originalUrl}`);
  }
};

const setupServer = async () => {
  await connectValkey();

  setupDraftEndpoints(server);

  const DIST_DIR = path.join(__dirname, "dist");
  const HTML_FILE = path.join(DIST_DIR, "index.html");

  server.use(setupProxy());

  server.get(
    "/unleash/toggles",
    redirectIfUnauthorized,
    (req: express.Request, res: express.Response) => {
      const togglesResponse = getToggles(
        req.query.veilederId,
        req.query.enhetId,
      );
      res.status(200).send(togglesResponse);
    },
  );

  server.get(
    "/health/isAlive",
    (_req: express.Request, res: express.Response) => {
      res.sendStatus(200);
    },
  );

  server.get(
    "/health/isReady",
    (_req: express.Request, res: express.Response) => {
      res.sendStatus(200);
    },
  );

  server.use("/", express.static(DIST_DIR));

  server.get(
    ["/", /^\/sykefravaer/],
    [nocache, redirectIfUnauthorized],
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      if (path.extname(req.path)) {
        return next();
      }

      res.sendFile(HTML_FILE);
    },
  );

  const port = 8080;

  server.listen(port, () => {
    logger.info(`App listening on port: ${port}`);
  });
};

setupServer();
