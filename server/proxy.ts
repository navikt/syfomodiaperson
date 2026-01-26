import express = require("express");
import OpenIdClient = require("openid-client");

import AuthUtils = require("./authUtils");
import Config = require("./config");
import { proxyRequest, ProxyConfig } from "./proxyHandler";

/**
 * Proxy request to external host without authentication.
 * Used for services that don't require on-behalf-of tokens.
 */
function proxyWithoutAuth(
  req: express.Request,
  res: express.Response,
  externalAppConfig: Config.ExternalAppConfig
): void {
  const config: ProxyConfig = {
    host: externalAppConfig.host,
    applicationName: externalAppConfig.applicationName,
    removePathPrefix: externalAppConfig.removePathPrefix,
  };

  proxyRequest(req, res, config);
}

/**
 * Proxy request to external host with on-behalf-of authentication.
 * Fetches OBO token and forwards request to the target service.
 */
function proxyOnBehalfOf(
  req: express.Request,
  res: express.Response,
  authClient: OpenIdClient.Client,
  issuer: OpenIdClient.Issuer<OpenIdClient.Client>,
  externalAppConfig: Config.ExternalAppConfig,
  rewritePath?: (path: string) => string
): void {
  AuthUtils.getOrRefreshOnBehalfOfToken(
    authClient,
    issuer,
    req,
    externalAppConfig.clientId
  )
    .then((onBehalfOfToken) => {
      if (!onBehalfOfToken?.accessToken) {
        console.error(
          "proxyOnBehalfOf: Got on-behalf-of token, but the accessToken was undefined"
        );
        res.status(500).send("Failed to fetch access token on behalf of user.");
        return;
      }

      const config: ProxyConfig = {
        host: externalAppConfig.host,
        applicationName: externalAppConfig.applicationName,
        removePathPrefix: externalAppConfig.removePathPrefix,
        accessToken: onBehalfOfToken.accessToken,
        rewritePath,
      };

      // Special case: syfosmregister needs fnr header from nav-personident
      if (externalAppConfig.host === Config.auth.syfosmregister.host) {
        const personIdent = req.headers["nav-personident"];
        if (typeof personIdent === "string") {
          config.additionalHeaders = { fnr: personIdent };
        }
      }

      proxyRequest(req, res, config);
    })
    .catch((error) => {
      console.error("Failed to renew token(s). Original error:", error);
      res
        .status(500)
        .send("Failed to fetch/refresh access tokens on behalf of user");
    });
}

export function setupProxy(
  authClient: OpenIdClient.Client,
  issuer: OpenIdClient.Issuer<OpenIdClient.Client>
): express.Router {
  const router = express.Router();

  router.use("/isaktivitetskrav", (req, res) => {
    proxyOnBehalfOf(req, res, authClient, issuer, Config.auth.isaktivitetskrav);
  });

  router.use("/isarbeidsuforhet", (req, res) => {
    proxyOnBehalfOf(req, res, authClient, issuer, Config.auth.isarbeidsuforhet);
  });

  router.use("/isbehandlerdialog", (req, res) => {
    proxyOnBehalfOf(
      req,
      res,
      authClient,
      issuer,
      Config.auth.isbehandlerdialog
    );
  });

  router.use("/isdialogmote", (req, res) => {
    proxyOnBehalfOf(req, res, authClient, issuer, Config.auth.isdialogmote);
  });

  router.use("/isdialogmotekandidat", (req, res) => {
    proxyOnBehalfOf(
      req,
      res,
      authClient,
      issuer,
      Config.auth.isdialogmotekandidat
    );
  });

  router.use("/isdialogmelding", (req, res) => {
    proxyOnBehalfOf(req, res, authClient, issuer, Config.auth.isdialogmelding);
  });

  router.use("/isfrisktilarbeid", (req, res) => {
    proxyOnBehalfOf(req, res, authClient, issuer, Config.auth.isfrisktilarbeid);
  });

  router.use("/ishuskelapp", (req, res) => {
    proxyOnBehalfOf(req, res, authClient, issuer, Config.auth.ishuskelapp);
  });

  router.use("/ismeroppfolging", (req, res) => {
    proxyOnBehalfOf(req, res, authClient, issuer, Config.auth.ismeroppfolging);
  });

  router.use("/isnarmesteleder", (req, res) => {
    proxyOnBehalfOf(req, res, authClient, issuer, Config.auth.isnarmesteleder);
  });

  router.use("/isoppfolgingstilfelle", (req, res) => {
    proxyOnBehalfOf(
      req,
      res,
      authClient,
      issuer,
      Config.auth.isoppfolgingstilfelle
    );
  });

  router.use("/ispengestopp", (req, res) => {
    proxyOnBehalfOf(req, res, authClient, issuer, Config.auth.ispengestopp);
  });

  router.use("/ispersonoppgave", (req, res) => {
    proxyOnBehalfOf(req, res, authClient, issuer, Config.auth.ispersonoppgave);
  });

  router.use("/fastlegerest", (req, res) => {
    proxyOnBehalfOf(req, res, authClient, issuer, Config.auth.fastlegerest);
  });

  router.use("/modiacontextholder", (req, res) => {
    proxyOnBehalfOf(
      req,
      res,
      authClient,
      issuer,
      Config.auth.modiacontextholder
    );
  });

  router.use("/syfobehandlendeenhet", (req, res) => {
    proxyOnBehalfOf(
      req,
      res,
      authClient,
      issuer,
      Config.auth.syfobehandlendeenhet
    );
  });

  router.use("/ereg", (req, res) => {
    proxyWithoutAuth(req, res, Config.auth.ereg);
  });

  router.use("/syfomotebehov", (req, res) => {
    proxyOnBehalfOf(req, res, authClient, issuer, Config.auth.syfomotebehov);
  });

  router.use("/syfooppfolgingsplanservice", (req, res) => {
    proxyOnBehalfOf(
      req,
      res,
      authClient,
      issuer,
      Config.auth.syfooppfolgingsplanservice
    );
  });

  router.use("/lps-oppfolgingsplan-mottak", (req, res) => {
    proxyOnBehalfOf(
      req,
      res,
      authClient,
      issuer,
      Config.auth.lpsOppfolgingsplanMottak
    );
  });

  router.use("/syfo-oppfolgingsplan-backend", (req, res) => {
    proxyOnBehalfOf(
      req,
      res,
      authClient,
      issuer,
      Config.auth.syfoOppfolgingsplanBackend
    );
  });

  router.use("/api/v2/persontildeling", (req, res) => {
    proxyOnBehalfOf(req, res, authClient, issuer, Config.auth.syfooversiktsrv);
  });

  router.use("/syfoperson", (req, res) => {
    proxyOnBehalfOf(req, res, authClient, issuer, Config.auth.syfoperson);
  });

  router.use("/syfosmregister", (req, res) => {
    proxyOnBehalfOf(
      req,
      res,
      authClient,
      issuer,
      Config.auth.syfosmregister,
      (path) => path.replace("/sykmeldinger", "/internal/sykmeldinger")
    );
  });

  router.use("/sykepengesoknad-backend", (req, res) => {
    proxyOnBehalfOf(
      req,
      res,
      authClient,
      issuer,
      Config.auth.sykepengesoknadBackend
    );
  });

  router.use("/istilgangskontroll", (req, res) => {
    proxyOnBehalfOf(
      req,
      res,
      authClient,
      issuer,
      Config.auth.istilgangskontroll
    );
  });

  router.use("/syfoveileder", (req, res) => {
    proxyOnBehalfOf(req, res, authClient, issuer, Config.auth.syfoveileder);
  });

  router.use("/meroppfolging-backend", (req, res) => {
    proxyOnBehalfOf(
      req,
      res,
      authClient,
      issuer,
      Config.auth.meroppfolgingBackend
    );
  });

  router.use("/sykepengedager-informasjon", (req, res) => {
    proxyOnBehalfOf(
      req,
      res,
      authClient,
      issuer,
      Config.auth.sykepengedagerinformasjon
    );
  });

  router.use("/flexjar-backend", (req, res) => {
    proxyOnBehalfOf(req, res, authClient, issuer, Config.auth.flexjar);
  });

  router.use("/veilarboppfolging", (req, res) => {
    proxyOnBehalfOf(
      req,
      res,
      authClient,
      issuer,
      Config.auth.veilarboppfolging
    );
  });

  router.use("/ismanglendemedvirkning", (req, res) => {
    proxyOnBehalfOf(
      req,
      res,
      authClient,
      issuer,
      Config.auth.ismanglendemedvirkning
    );
  });

  router.use("/isoppfolgingsplan", (req, res) => {
    proxyOnBehalfOf(
      req,
      res,
      authClient,
      issuer,
      Config.auth.isoppfolgingsplan
    );
  });

  router.use("/pensjon-pen", (req, res) => {
    proxyOnBehalfOf(req, res, authClient, issuer, Config.auth.pensjonPenUfore);
  });

  return router;
}

module.exports = {
  setupProxy: setupProxy,
};
