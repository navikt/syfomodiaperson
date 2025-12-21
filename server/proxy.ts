import express = require("express");
import proxy = require("express-http-proxy");
import OpenIdClient = require("openid-client");
import url = require("url");

import AuthUtils = require("./authUtils");
import Config = require("./config");

const proxyExternalHostWithoutAuthentication = (host: any) =>
  proxy(host, {
    https: false,
    proxyReqPathResolver: (req) => {
      const urlFromApi = url.parse(host);
      const pathFromApi =
        urlFromApi.pathname === "/" ? "" : urlFromApi.pathname;

      const urlFromRequest = url.parse(req.originalUrl);
      const pathFromRequest = urlFromRequest.pathname;

      const queryString = urlFromRequest.query;
      const newPath =
        (pathFromApi ? pathFromApi : "") +
        (pathFromRequest ? pathFromRequest : "") +
        (queryString ? "?" + queryString : "");

      return newPath;
    },
    proxyErrorHandler: (err, res, next) => {
      console.log(`Error in proxy for ${host} ${err.message}, ${err.code}`);
      if (err && err.code === "ECONNREFUSED") {
        console.log("proxyErrorHandler: Got ECONNREFUSED");
        return res.status(503).send({ message: `Could not contact ${host}` });
      }
      next(err);
    },
  });

const proxyDirectly = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
  authClient: any,
  externalAppConfig: Config.ExternalAppConfig
) => {
  return proxyExternalHostWithoutAuthentication(externalAppConfig.host)(
    req,
    res,
    next
  );
};

const proxyExternalHost = (
  { applicationName, host, removePathPrefix }: any,
  accessToken: any,
  parseReqBody: any,
  rewritePath?: (path: string) => string
) =>
  proxy(host, {
    https: false,
    parseReqBody: parseReqBody,
    proxyReqOptDecorator: async (options, srcReq) => {
      if (!accessToken) {
        return options;
      }
      if (!options.headers) {
        options.headers = {};
      }
      options.headers["Authorization"] = `Bearer ${accessToken}`;
      if (host === Config.auth.syfosmregister.host) {
        options.headers["fnr"] = options.headers["nav-personident"]; // TODO: brukes dette?
      }
      return options;
    },
    proxyReqPathResolver: (req) => {
      const urlFromApi = url.parse(host);
      const pathFromApi =
        urlFromApi.pathname === "/" ? "" : urlFromApi.pathname;

      const urlFromRequest = url.parse(req.originalUrl);
      const pathFromRequest = urlFromRequest.pathname;

      const queryString = urlFromRequest.query;
      const newPath =
        (pathFromApi ? pathFromApi : "") +
        (pathFromRequest ? pathFromRequest : "") +
        (queryString ? "?" + queryString : "");

      if (removePathPrefix) {
        const newPathWithoutPrefix = newPath.replace(`${applicationName}/`, "");
        return rewritePath != null
          ? rewritePath(newPathWithoutPrefix)
          : newPathWithoutPrefix;
      }
      return rewritePath != null ? rewritePath(newPath) : newPath;
    },
    proxyErrorHandler: (err, res, next) => {
      console.log(`Error in proxy for ${host} ${err.message}, ${err.code}`);
      if (err && err.code === "ECONNREFUSED") {
        console.log("proxyErrorHandler: Got ECONNREFUSED");
        return res.status(503).send({ message: `Could not contact ${host}` });
      }
      next(err);
    },
  });

const proxyOnBehalfOf = (
  req: any,
  res: any,
  next: any,
  authClient: any,
  issuer: OpenIdClient.Issuer<any>,
  externalAppConfig: Config.ExternalAppConfig,
  rewritePath?: (path: string) => string
) => {
  AuthUtils.getOrRefreshOnBehalfOfToken(
    authClient,
    issuer,
    req,
    externalAppConfig.clientId
  )
    .then((onBehalfOfToken: any) => {
      if (!onBehalfOfToken.accessToken) {
        res.status(500).send("Failed to fetch access token on behalf of user.");
        console.log(
          "proxyOnBehalfOf: Got on-behalf-of token, but the accessToken was undefined"
        );
        return;
      }
      return proxyExternalHost(
        externalAppConfig,
        onBehalfOfToken.accessToken,
        req.method === "POST",
        rewritePath
      )(req, res, next);
    })
    .catch((error) => {
      console.log("Failed to renew token(s). Original error: %s", error);
      res
        .status(500)
        .send("Failed to fetch/refresh access tokens on behalf of user");
    });
};

export const setupProxy = (
  authClient: OpenIdClient.Client,
  issuer: OpenIdClient.Issuer<any>
) => {
  const router = express.Router();

  router.use(
    "/isaktivitetskrav/:path(.*)",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(
        req,
        res,
        next,
        authClient,
        issuer,
        Config.auth.isaktivitetskrav
      );
    }
  );

  router.use(
    "/isarbeidsuforhet/:path(.*)",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(
        req,
        res,
        next,
        authClient,
        issuer,
        Config.auth.isarbeidsuforhet
      );
    }
  );

  router.use(
    "/isbehandlerdialog/:path(.*)",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(
        req,
        res,
        next,
        authClient,
        issuer,
        Config.auth.isbehandlerdialog
      );
    }
  );

  router.use(
    "/isdialogmote/:path(.*)",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(
        req,
        res,
        next,
        authClient,
        issuer,
        Config.auth.isdialogmote
      );
    }
  );

  router.use(
    "/isdialogmotekandidat/:path(.*)",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(
        req,
        res,
        next,
        authClient,
        issuer,
        Config.auth.isdialogmotekandidat
      );
    }
  );

  router.use(
    "/isdialogmelding/:path(.*)",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(
        req,
        res,
        next,
        authClient,
        issuer,
        Config.auth.isdialogmelding
      );
    }
  );

  router.use(
    "/isfrisktilarbeid/:path(.*)",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(
        req,
        res,
        next,
        authClient,
        issuer,
        Config.auth.isfrisktilarbeid
      );
    }
  );

  router.use(
    "/ishuskelapp/:path(.*)",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(
        req,
        res,
        next,
        authClient,
        issuer,
        Config.auth.ishuskelapp
      );
    }
  );

  router.use(
    "/ismeroppfolging/:path(.*)",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(
        req,
        res,
        next,
        authClient,
        issuer,
        Config.auth.ismeroppfolging
      );
    }
  );

  router.use(
    "/isnarmesteleder/:path(.*)",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(
        req,
        res,
        next,
        authClient,
        issuer,
        Config.auth.isnarmesteleder
      );
    }
  );

  router.use(
    "/isoppfolgingstilfelle/:path(.*)",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(
        req,
        res,
        next,
        authClient,
        issuer,
        Config.auth.isoppfolgingstilfelle
      );
    }
  );

  router.use(
    "/ispengestopp/:path(.*)",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(
        req,
        res,
        next,
        authClient,
        issuer,
        Config.auth.ispengestopp
      );
    }
  );

  router.use(
    "/ispersonoppgave/:path(.*)",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(
        req,
        res,
        next,
        authClient,
        issuer,
        Config.auth.ispersonoppgave
      );
    }
  );

  router.use(
    "/fastlegerest/:path(.*)",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(
        req,
        res,
        next,
        authClient,
        issuer,
        Config.auth.fastlegerest
      );
    }
  );

  router.use(
    "/modiacontextholder/:path(.*)",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(
        req,
        res,
        next,
        authClient,
        issuer,
        Config.auth.modiacontextholder
      );
    }
  );

  router.use(
    "/syfobehandlendeenhet/:path(.*)",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(
        req,
        res,
        next,
        authClient,
        issuer,
        Config.auth.syfobehandlendeenhet
      );
    }
  );

  router.use(
    "/ereg/:path(.*)",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyDirectly(req, res, next, authClient, Config.auth.ereg);
    }
  );

  router.use(
    "/syfomotebehov/:path(.*)",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(
        req,
        res,
        next,
        authClient,
        issuer,
        Config.auth.syfomotebehov
      );
    }
  );

  router.use(
    "/syfooppfolgingsplanservice/:path(.*)",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(
        req,
        res,
        next,
        authClient,
        issuer,
        Config.auth.syfooppfolgingsplanservice
      );
    }
  );

  router.use(
    "/lps-oppfolgingsplan-mottak/:path(.*)",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(
        req,
        res,
        next,
        authClient,
        issuer,
        Config.auth.lpsOppfolgingsplanMottak
      );
    }
  );

  router.use(
    "/syfo-oppfolgingsplan-backend/:path(.*)",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(
        req,
        res,
        next,
        authClient,
        issuer,
        Config.auth.syfoOppfolgingsplanBackend
      );
    }
  );

  router.use(
    "/api/v2/persontildeling/:path(.*)",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(
        req,
        res,
        next,
        authClient,
        issuer,
        Config.auth.syfooversiktsrv
      );
    }
  );

  router.use(
    "/syfoperson/:path(.*)",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(
        req,
        res,
        next,
        authClient,
        issuer,
        Config.auth.syfoperson
      );
    }
  );

  router.use(
    "/syfosmregister/:path(.*)",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(
        req,
        res,
        next,
        authClient,
        issuer,
        Config.auth.syfosmregister,
        (path) => path.replace("/sykmeldinger", "/internal/sykmeldinger")
      );
    }
  );

  router.use(
    "/sykepengesoknad-backend/:path(.*)",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(
        req,
        res,
        next,
        authClient,
        issuer,
        Config.auth.sykepengesoknadBackend
      );
    }
  );

  router.use(
    "/istilgangskontroll/:path(.*)",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(
        req,
        res,
        next,
        authClient,
        issuer,
        Config.auth.istilgangskontroll
      );
    }
  );

  router.use(
    "/syfoveileder/:path(.*)",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(
        req,
        res,
        next,
        authClient,
        issuer,
        Config.auth.syfoveileder
      );
    }
  );

  router.use(
    "/meroppfolging-backend/:path(.*)",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(
        req,
        res,
        next,
        authClient,
        issuer,
        Config.auth.meroppfolgingBackend
      );
    }
  );

  router.use(
    "/sykepengedager-informasjon/:path(.*)",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(
        req,
        res,
        next,
        authClient,
        issuer,
        Config.auth.sykepengedagerinformasjon
      );
    }
  );

  router.use(
    "/flexjar-backend/:path(.*)",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(req, res, next, authClient, issuer, Config.auth.flexjar);
    }
  );

  router.use(
    "/veilarboppfolging/:path(.*)",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(
        req,
        res,
        next,
        authClient,
        issuer,
        Config.auth.veilarboppfolging
      );
    }
  );

  router.use(
    "/ismanglendemedvirkning/:path(.*)",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(
        req,
        res,
        next,
        authClient,
        issuer,
        Config.auth.ismanglendemedvirkning
      );
    }
  );

  router.use(
    "/isoppfolgingsplan/:path(.*)",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(
        req,
        res,
        next,
        authClient,
        issuer,
        Config.auth.isoppfolgingsplan
      );
    }
  );

  router.use(
    "/pensjon-pen/:path(.*)",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(
        req,
        res,
        next,
        authClient,
        issuer,
        Config.auth.pensjonPenUfore
      );
    }
  );

  return router;
};

module.exports = {
  setupProxy: setupProxy,
};
