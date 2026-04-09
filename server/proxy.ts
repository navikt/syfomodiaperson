import express = require("express");
import proxy = require("express-http-proxy");
import url = require("url");

import { getOnBehalfOfToken } from "./authUtils";
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

const proxyExternalHost = (
  { applicationName, host, removePathPrefix }: any,
  accessToken: any,
  parseReqBody: any,
  rewritePath?: (path: string) => string
) =>
  proxy(host, {
    https: false,
    parseReqBody: parseReqBody,
    timeout: 30000,
    proxyReqOptDecorator: async (options) => {
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
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
  externalAppConfig: Config.ExternalAppConfig,
  rewritePath?: (path: string) => string
) => {
  getOnBehalfOfToken(req, externalAppConfig.clientId)
    .then((accessToken) => {
      if (!accessToken) {
        res.status(500).send("Failed to fetch access token on behalf of user.");
        console.log("proxyOnBehalfOf: on-behalf-of-token was undefined");
        return;
      }
      return proxyExternalHost(
        externalAppConfig,
        accessToken,
        req.method === "POST",
        rewritePath
      )(req, res, next);
    })
    .catch((error) => {
      console.log("Failed to get OBO token. Original error: %s", error);
      res.status(500).send("Failed to fetch access tokens on behalf of user");
    });
};

export const setupProxy = () => {
  const router = express.Router();

  router.use(
    "/isaktivitetskrav",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(req, res, next, Config.auth.isaktivitetskrav);
    }
  );

  router.use(
    "/isarbeidsuforhet",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(req, res, next, Config.auth.isarbeidsuforhet);
    }
  );

  router.use(
    "/isbehandlerdialog",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(req, res, next, Config.auth.isbehandlerdialog);
    }
  );

  router.use(
    "/isdialogmote",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(req, res, next, Config.auth.isdialogmote);
    }
  );

  router.use(
    "/isdialogmotekandidat",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(req, res, next, Config.auth.isdialogmotekandidat);
    }
  );

  router.use(
    "/isdialogmelding",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(req, res, next, Config.auth.isdialogmelding);
    }
  );

  router.use(
    "/isfrisktilarbeid",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(req, res, next, Config.auth.isfrisktilarbeid);
    }
  );

  router.use(
    "/ishuskelapp",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(req, res, next, Config.auth.ishuskelapp);
    }
  );

  router.use(
    "/ismeroppfolging",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(req, res, next, Config.auth.ismeroppfolging);
    }
  );

  router.use(
    "/isnarmesteleder",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(req, res, next, Config.auth.isnarmesteleder);
    }
  );

  router.use(
    "/isoppfolgingstilfelle",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(req, res, next, Config.auth.isoppfolgingstilfelle);
    }
  );

  router.use(
    "/ispengestopp",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(req, res, next, Config.auth.ispengestopp);
    }
  );

  router.use(
    "/ispersonoppgave",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(req, res, next, Config.auth.ispersonoppgave);
    }
  );

  router.use(
    "/fastlegerest",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(req, res, next, Config.auth.fastlegerest);
    }
  );

  router.use(
    "/modiacontextholder",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(req, res, next, Config.auth.modiacontextholder);
    }
  );

  router.use(
    "/syfobehandlendeenhet",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(req, res, next, Config.auth.syfobehandlendeenhet);
    }
  );

  router.use(
    "/ereg",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyExternalHostWithoutAuthentication(Config.auth.ereg.host)(
        req,
        res,
        next
      );
    }
  );

  router.use(
    "/syfomotebehov",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(req, res, next, Config.auth.syfomotebehov);
    }
  );

  router.use(
    "/syfooppfolgingsplanservice",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(req, res, next, Config.auth.syfooppfolgingsplanservice);
    }
  );

  router.use(
    "/lps-oppfolgingsplan-mottak",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(req, res, next, Config.auth.lpsOppfolgingsplanMottak);
    }
  );

  router.use(
    "/syfo-oppfolgingsplan-backend",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(req, res, next, Config.auth.syfoOppfolgingsplanBackend);
    }
  );

  router.use(
    "/api/v2/persontildeling",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(req, res, next, Config.auth.syfooversiktsrv);
    }
  );

  router.use(
    "/syfoperson",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(req, res, next, Config.auth.syfoperson);
    }
  );

  router.use(
    "/syfosmregister",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(req, res, next, Config.auth.syfosmregister, (path) =>
        path.replace("/sykmeldinger", "/internal/sykmeldinger")
      );
    }
  );

  router.use(
    "/sykepengesoknad-backend",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(req, res, next, Config.auth.sykepengesoknadBackend);
    }
  );

  router.use(
    "/istilgangskontroll",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(req, res, next, Config.auth.istilgangskontroll);
    }
  );

  router.use(
    "/syfoveileder",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(req, res, next, Config.auth.syfoveileder);
    }
  );

  router.use(
    "/meroppfolging-backend",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(req, res, next, Config.auth.meroppfolgingBackend);
    }
  );

  router.use(
    "/sykepengedager-informasjon",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(req, res, next, Config.auth.sykepengedagerinformasjon);
    }
  );

  router.use(
    "/flexjar-backend",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(req, res, next, Config.auth.flexjar);
    }
  );

  router.use(
    "/lumi-api",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(req, res, next, Config.auth.lumiApi);
    }
  );

  router.use(
    "/veilarboppfolging",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(req, res, next, Config.auth.veilarboppfolging);
    }
  );

  router.use(
    "/ismanglendemedvirkning",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(req, res, next, Config.auth.ismanglendemedvirkning);
    }
  );

  router.use(
    "/isoppfolgingsplan",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(req, res, next, Config.auth.isoppfolgingsplan);
    }
  );

  router.use(
    "/pensjon-pen",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(req, res, next, Config.auth.pensjonPenUfore);
    }
  );

  return router;
};

module.exports = {
  setupProxy: setupProxy,
};
