const express = require("express");
const proxy = require("express-http-proxy");
const url = require("url");

const AuthUtils = require("./auth/utils.js");
const Config = require("./config.js");

const proxyExternalHost = (
  { applicationName, host, removePathPrefix },
  accessToken,
  parseReqBody
) =>
  proxy(host, {
    https: true,
    parseReqBody: parseReqBody,
    proxyReqOptDecorator: async (options, srcReq) => {
      if (!accessToken) {
        return options;
      }
      if (!options.headers) {
        options.headers = {};
      }
      if (host === Config.auth.modiacontextholder.host) {
        const reqUser = srcReq.user;
        if (!reqUser) {
          return options;
        }
        const selfAccessToken = reqUser.tokenSets.self.access_token;
        options.headers["Authorization"] = `Bearer ${selfAccessToken}`;
        options.headers["Cookie"] = `isso-accesstoken=${accessToken}`;
      } else {
        options.headers["Authorization"] = `Bearer ${accessToken}`;
      }
      if (host === Config.auth.syfosmregister.host) {
        options.headers["fnr"] = options.headers["nav-personident"];
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
        return `https://${newPathWithoutPrefix}`;
      }
      return `https://${newPath}`;
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

const proxyOnBehalfOf = (req, res, next, authClient, externalAppConfig) => {
  const user = req.user;
  if (!user) {
    console.log("Missing user in route, waiting for middleware authentication");
    res
      .status(401)
      .header(
        "WWW-Authenticate",
        `OAuth realm=${externalAppConfig.host}, charset="UTF-8"`
      )
      .send("Not authenticated");
    return;
  }

  AuthUtils.getOrRefreshOnBehalfOfToken(
    authClient,
    user.tokenSets,
    externalAppConfig.tokenSetId,
    externalAppConfig.clientId
  )
    .then((onBehalfOfToken) => {
      if (!onBehalfOfToken.access_token) {
        res.status(500).send("Failed to fetch access token on behalf of user.");
        console.log(
          "proxyReqOptDecorator: Got on-behalf-of token, but the access_token was undefined"
        );
        return;
      }
      return proxyExternalHost(
        externalAppConfig,
        onBehalfOfToken.access_token,
        req.method === "POST"
      )(req, res, next);
    })
    .catch((error) => {
      console.log("Failed to renew token(s). Original error: %s", error);
      res
        .status(500)
        .send("Failed to fetch/refresh access tokens on behalf of user");
    });
};

const setup = (authClient) => {
  const router = express.Router();

  router.use("/isdialogmote/*", (req, res, next) => {
    proxyOnBehalfOf(req, res, next, authClient, Config.auth.isdialogmote);
  });

  router.use("/isdialogmelding/*", (req, res, next) => {
    proxyOnBehalfOf(req, res, next, authClient, Config.auth.isdialogmelding);
  });

  router.use("/isnarmesteleder/*", (req, res, next) => {
    proxyOnBehalfOf(req, res, next, authClient, Config.auth.isnarmesteleder);
  });

  router.use("/ispengestopp/*", (req, res, next) => {
    proxyOnBehalfOf(req, res, next, authClient, Config.auth.ispengestopp);
  });

  router.use("/ispersonoppgave/*", (req, res, next) => {
    proxyOnBehalfOf(req, res, next, authClient, Config.auth.ispersonoppgave);
  });

  router.use("/fastlegerest/*", (req, res, next) => {
    proxyOnBehalfOf(req, res, next, authClient, Config.auth.fastlegerest);
  });

  router.use("/modiacontextholder/*", (req, res, next) => {
    proxyOnBehalfOf(req, res, next, authClient, Config.auth.modiacontextholder);
  });

  router.use("/modiasyforest/*", (req, res, next) => {
    proxyOnBehalfOf(req, res, next, authClient, Config.auth.modiasyforest);
  });

  router.use("/spinnsyn-backend/*", (req, res, next) => {
    proxyOnBehalfOf(req, res, next, authClient, Config.auth.flexInternGateway);
  });

  router.use("/syfobehandlendeenhet/*", (req, res, next) => {
    proxyOnBehalfOf(
      req,
      res,
      next,
      authClient,
      Config.auth.syfobehandlendeenhet
    );
  });

  router.use("/syfomoteadmin/*", (req, res, next) => {
    proxyOnBehalfOf(req, res, next, authClient, Config.auth.syfomoteadmin);
  });

  router.use("/syfomotebehov/*", (req, res, next) => {
    proxyOnBehalfOf(req, res, next, authClient, Config.auth.syfomotebehov);
  });

  router.use("/syfooppfolgingsplanservice/*", (req, res, next) => {
    proxyOnBehalfOf(
      req,
      res,
      next,
      authClient,
      Config.auth.syfooppfolgingsplanservice
    );
  });

  router.use("/syfoperson/*", (req, res, next) => {
    proxyOnBehalfOf(req, res, next, authClient, Config.auth.syfoperson);
  });

  router.use("/syfosmregister/*", (req, res, next) => {
    proxyOnBehalfOf(req, res, next, authClient, Config.auth.syfosmregister);
  });

  router.use("/syfosoknad/*", (req, res, next) => {
    proxyOnBehalfOf(req, res, next, authClient, Config.auth.syfosoknad);
  });

  router.use("/syfo-tilgangskontroll/*", (req, res, next) => {
    proxyOnBehalfOf(
      req,
      res,
      next,
      authClient,
      Config.auth.syfotilgangskontroll
    );
  });

  router.use("/syfoveileder/*", (req, res, next) => {
    proxyOnBehalfOf(req, res, next, authClient, Config.auth.syfoveileder);
  });

  router.use(
    "/internarbeidsflatedecorator",
    proxy(Config.auth.internarbeidsflatedecoratorHost, {
      https: true,
      proxyReqPathResolver: (req) => {
        return `/internarbeidsflatedecorator${req.url}`;
      },
      proxyErrorHandler: (err, res, next) => {
        console.log(
          `Error in proxy for internarbeidsflatedecorator ${err.message}, ${err.code}`
        );
        if (err && err.code === "ECONNREFUSED") {
          console.log("proxyErrorHandler: Got ECONNREFUSED");
          return res
            .status(503)
            .send({ message: `Could not contact internarbeidsflatedecorator` });
        }
        next(err);
      },
    })
  );

  return router;
};

module.exports = setup;
