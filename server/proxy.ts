import express from "express";

import { getOnBehalfOfToken } from "./authUtils.js";
import type { ExternalAppConfig } from "./config.js";
import Config from "./config.js";
import { logger } from "@navikt/pino-logger";

const TRANSIENT_ERROR_CODES = new Set([
  "ECONNRESET",
  "EPIPE",
  "ECONNABORTED",
  "ETIMEDOUT",
  "ECONNREFUSED",
]);

/** Headers that must not be forwarded between proxy and backend (hop-by-hop). */
const EXCLUDED_HEADERS = new Set([
  "host",
  "connection",
  "keep-alive",
  "transfer-encoding",
  "te",
  "trailers",
  "proxy-authenticate",
  "proxy-authorization",
  "upgrade",
  "content-length",
  "content-encoding",
]);

function buildTargetUrl(
  host: string,
  req: express.Request,
  applicationName: string,
  removePathPrefix: boolean,
  rewritePath?: (path: string) => string
): string {
  const hostUrl = new URL(host);
  const basePath = hostUrl.pathname === "/" ? "" : hostUrl.pathname;

  const reqUrl = new URL(req.originalUrl, "http://localhost");
  let path = basePath + reqUrl.pathname + reqUrl.search;

  if (removePathPrefix) {
    const appPathPrefix = `/${applicationName}`;
    if (path.startsWith(`${appPathPrefix}/`)) {
      path = path.slice(appPathPrefix.length);
    }
  }

  if (rewritePath) {
    path = rewritePath(path);
  }

  return `${hostUrl.protocol}//${hostUrl.host}${path}`;
}

function buildForwardedHeaders(
  req: express.Request,
  accessToken?: string,
  isSyfosmregister = false
): Record<string, string> {
  const headers: Record<string, string> = {};

  for (const [key, value] of Object.entries(req.headers)) {
    if (!EXCLUDED_HEADERS.has(key.toLowerCase()) && typeof value === "string") {
      headers[key] = value;
    }
  }

  if (accessToken) {
    headers["authorization"] = `Bearer ${accessToken}`;
  }
  if (isSyfosmregister) {
    headers["fnr"] = headers["nav-personident"];
  }

  return headers;
}

function getErrorCode(error: unknown): string | undefined {
  if (error instanceof TypeError) {
    const cause = (error as TypeError & { cause?: unknown }).cause;
    if (cause instanceof Error) {
      return (cause as NodeJS.ErrnoException).code;
    }
  }
  return undefined;
}

/** Checks if a header key exists in the headers map using case-insensitive comparison. */
function hasHeader(headers: Record<string, string>, headerName: string): boolean {
  const lowerCaseHeaderName = headerName.toLowerCase();
  for (const key in headers) {
    if (key.toLowerCase() === lowerCaseHeaderName) {
      return true;
    }
  }

  return false;
}

async function sendProxyRequest(
  targetUrl: string,
  req: express.Request,
  res: express.Response,
  headers: Record<string, string>
): Promise<void> {
  const hasBody =
    ["POST", "PUT", "PATCH"].includes(req.method) && req.body !== undefined;
  const hasContentTypeHeader = hasHeader(headers, "content-type");
  const forwardedHeaders =
    hasBody && !hasContentTypeHeader
      ? { ...headers, "content-type": "application/json" }
      : headers;

  const response = await fetch(targetUrl, {
    method: req.method,
    headers: forwardedHeaders,
    body: hasBody ? JSON.stringify(req.body) : undefined,
    signal: AbortSignal.timeout(30_000),
  });

  res.status(response.status);

  response.headers.forEach((value, key) => {
    if (!EXCLUDED_HEADERS.has(key.toLowerCase())) {
      res.setHeader(key, value);
    }
  });

  const buffer = await response.arrayBuffer();
  res.end(Buffer.from(buffer));
}

/** Creates a middleware that proxies the request to an external service using an OBO token. */
const proxyOnBehalfOf =
  (
    externalAppConfig: ExternalAppConfig,
    rewritePath?: (path: string) => string
  ): express.RequestHandler =>
  async (req, res, next) => {
    const {
      applicationName,
      host,
      clientId,
      removePathPrefix = false,
    } = externalAppConfig;

    let accessToken: string | undefined;
    try {
      accessToken = await getOnBehalfOfToken(req, clientId);
    } catch (error) {
      logger.error("Failed to get OBO token. Original error: %s", error);
      res.status(500).send("Failed to fetch access tokens on behalf of user");
      return;
    }

    if (!accessToken) {
      res.status(500).send("Failed to fetch access token on behalf of user.");
      logger.error("proxyOnBehalfOf: on-behalf-of-token was undefined");
      return;
    }

    const targetUrl = buildTargetUrl(
      host,
      req,
      applicationName,
      removePathPrefix,
      rewritePath
    );
    const isSyfosmregister =
      applicationName === Config.auth.syfosmregister.applicationName;
    const headers = buildForwardedHeaders(req, accessToken, isSyfosmregister);

    try {
      await sendProxyRequest(targetUrl, req, res, headers);
    } catch (error) {
      const code = getErrorCode(error);
      logger.error(
        `Error in proxy for ${host} ${
          error instanceof Error ? error.message : error
        }, ${code}`
      );
      if (code && TRANSIENT_ERROR_CODES.has(code)) {
        res.status(502).send({ message: `Could not contact ${host}` });
        return;
      }
      next(error);
    }
  };

/** Creates a middleware that proxies the request to an external service without authentication. */
const proxyWithoutAuthentication =
  (host: string): express.RequestHandler =>
  async (req, res, next) => {
    const targetUrl = buildTargetUrl(host, req, "", false);
    const headers = buildForwardedHeaders(req);

    try {
      await sendProxyRequest(targetUrl, req, res, headers);
    } catch (error) {
      const code = getErrorCode(error);
      logger.error(
        `Error in proxy for ${host} ${
          error instanceof Error ? error.message : error
        }, ${code}`
      );
      if (code && TRANSIENT_ERROR_CODES.has(code)) {
        res.status(502).send({ message: `Could not contact ${host}` });
        return;
      }
      next(error);
    }
  };

export const setupProxy = (): express.Router => {
  const router = express.Router();

  router.use(
    "/isaktivitetskrav",
    proxyOnBehalfOf(Config.auth.isaktivitetskrav)
  );
  router.use(
    "/isarbeidsuforhet",
    proxyOnBehalfOf(Config.auth.isarbeidsuforhet)
  );
  router.use(
    "/isbehandlerdialog",
    proxyOnBehalfOf(Config.auth.isbehandlerdialog)
  );
  router.use("/isdialogmote", proxyOnBehalfOf(Config.auth.isdialogmote));
  router.use(
    "/isdialogmotekandidat",
    proxyOnBehalfOf(Config.auth.isdialogmotekandidat)
  );
  router.use("/isdialogmelding", proxyOnBehalfOf(Config.auth.isdialogmelding));
  router.use(
    "/isfrisktilarbeid",
    proxyOnBehalfOf(Config.auth.isfrisktilarbeid)
  );
  router.use("/ishuskelapp", proxyOnBehalfOf(Config.auth.ishuskelapp));
  router.use("/ismeroppfolging", proxyOnBehalfOf(Config.auth.ismeroppfolging));
  router.use("/isnarmesteleder", proxyOnBehalfOf(Config.auth.isnarmesteleder));
  router.use(
    "/isoppfolgingstilfelle",
    proxyOnBehalfOf(Config.auth.isoppfolgingstilfelle)
  );
  router.use("/ispengestopp", proxyOnBehalfOf(Config.auth.ispengestopp));
  router.use("/ispersonoppgave", proxyOnBehalfOf(Config.auth.ispersonoppgave));
  router.use("/fastlegerest", proxyOnBehalfOf(Config.auth.fastlegerest));
  router.use(
    "/modiacontextholder",
    proxyOnBehalfOf(Config.auth.modiacontextholder)
  );
  router.use(
    "/syfobehandlendeenhet",
    proxyOnBehalfOf(Config.auth.syfobehandlendeenhet)
  );
  router.use("/ereg", proxyWithoutAuthentication(Config.auth.ereg.host));
  router.use("/syfomotebehov", proxyOnBehalfOf(Config.auth.syfomotebehov));
  router.use(
    "/syfooppfolgingsplanservice",
    proxyOnBehalfOf(Config.auth.syfooppfolgingsplanservice)
  );
  router.use(
    "/lps-oppfolgingsplan-mottak",
    proxyOnBehalfOf(Config.auth.lpsOppfolgingsplanMottak)
  );
  router.use(
    "/syfo-oppfolgingsplan-backend",
    proxyOnBehalfOf(Config.auth.syfoOppfolgingsplanBackend)
  );
  router.use(
    "/api/v2/persontildeling",
    proxyOnBehalfOf(Config.auth.syfooversiktsrv)
  );
  router.use("/syfoperson", proxyOnBehalfOf(Config.auth.syfoperson));
  router.use(
    "/syfosmregister",
    proxyOnBehalfOf(Config.auth.syfosmregister, (path) =>
      path.replace("/sykmeldinger", "/internal/sykmeldinger")
    )
  );
  router.use(
    "/sykepengesoknad-backend",
    proxyOnBehalfOf(Config.auth.sykepengesoknadBackend)
  );
  router.use(
    "/istilgangskontroll",
    proxyOnBehalfOf(Config.auth.istilgangskontroll)
  );
  router.use("/syfoveileder", proxyOnBehalfOf(Config.auth.syfoveileder));
  router.use(
    "/meroppfolging-backend",
    proxyOnBehalfOf(Config.auth.meroppfolgingBackend)
  );
  router.use(
    "/sykepengedager-informasjon",
    proxyOnBehalfOf(Config.auth.sykepengedagerinformasjon)
  );
  router.use("/flexjar-backend", proxyOnBehalfOf(Config.auth.flexjar));
  router.use("/lumi-api", proxyOnBehalfOf(Config.auth.lumiApi));
  router.use(
    "/veilarboppfolging",
    proxyOnBehalfOf(Config.auth.veilarboppfolging)
  );
  router.use(
    "/ismanglendemedvirkning",
    proxyOnBehalfOf(Config.auth.ismanglendemedvirkning)
  );
  router.use(
    "/isoppfolgingsplan",
    proxyOnBehalfOf(Config.auth.isoppfolgingsplan)
  );
  router.use("/pensjon-pen", proxyOnBehalfOf(Config.auth.pensjonPenUfore));

  return router;
};
