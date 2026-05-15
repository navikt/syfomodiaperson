import express from "express";
import helmet from "helmet";
import path from "path";
import prometheus from "prom-client";
import { fileURLToPath } from "url";
import { getToggles } from "./server/unleash.js";
import { validateToken } from "./server/authUtils.js";
import { setupProxy } from "./server/proxy.js";
import { setupDraftEndpoints } from "./server/draft.js";
import { connectValkey } from "./server/valkey.js";
import { logger } from "@navikt/pino-logger";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Prometheus metrics
const collectDefaultMetrics = prometheus.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

const httpRequestDurationMicroseconds = new prometheus.Histogram({
  name: "http_request_duration_ms",
  help: "Duration of HTTP requests in ms",
  labelNames: ["route"],
  // buckets for response time from 0.1ms to 500ms
  buckets: [0.1, 5, 15, 50, 100, 200, 300, 400, 500],
});
const server = express();

server.use(express.json());
server.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

const nocache = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.header("Expires", "-1");
  res.header("Pragma", "no-cache");
  next();
};

const redirectIfUnauthorized = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
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
        req.query.enhetId
      );
      res.status(200).send(togglesResponse);
    }
  );

  server.get(
    "/actuator/metrics",
    (req: express.Request, res: express.Response) => {
      res.set("Content-Type", prometheus.register.contentType);
      res.end(prometheus.register.metrics());
    }
  );

  server.get(
    "/health/isAlive",
    (req: express.Request, res: express.Response) => {
      res.sendStatus(200);
    }
  );

  server.get(
    "/health/isReady",
    (req: express.Request, res: express.Response) => {
      res.sendStatus(200);
    }
  );

  server.use("/", express.static(DIST_DIR));

  server.get(
    ["/", /^\/sykefravaer/],
    [nocache, redirectIfUnauthorized],
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      if (path.extname(req.path)) {
        return next();
      }

      res.sendFile(HTML_FILE);
    }
  );

  const port = 8080;

  server.listen(port, () => {
    logger.info(`App listening on port: ${port}`);
  });
};

setupServer();
