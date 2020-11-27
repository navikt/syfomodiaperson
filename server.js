const express = require("express");
const path = require("path");
const prometheus = require("prom-client");
const proxy = require("express-http-proxy");
const cookieParser = require("cookie-parser");
const axios = require("axios");

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

const modiacontextholderUrl =
  process.env.NAIS_CONTEXT === "dev"
    ? "modiacontextholder.q1"
    : "modiacontextholder.default";

const spinnsynBackendVeilederUrl =
  process.env.NAIS_CONTEXT === "dev"
    ? "spinnsyn-backend-veileder-proxy.dev.intern.nav.no"
    : "spinnsyn-backend-veileder-proxy.intern.nav.no";

function nocache(req, res, next) {
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.header("Expires", "-1");
  res.header("Pragma", "no-cache");
  next();
}

const DIST_DIR = path.join(__dirname, "dist");
const HTML_FILE = path.join(DIST_DIR, "index.html");

server.use("/sykefravaer/img", express.static(path.resolve(__dirname, "img")));

server.use("/static", express.static(DIST_DIR));

server.get("/sykefravaer/*", nocache, (req, res) => {
  res.sendFile(HTML_FILE);
  httpRequestDurationMicroseconds.labels(req.route.path).observe(10);
});

server.get("/actuator/metrics", (req, res) => {
  res.set("Content-Type", prometheus.register.contentType);
  res.end(prometheus.register.metrics());
});

server.get("/health/isAlive", (req, res) => {
  res.sendStatus(200);
});

server.get("/health/isReady", (req, res) => {
  res.sendStatus(200);
});

server.use(
  "/fastlegerest/api",
  proxy("fastlegerest.default", {
    https: false,
    proxyReqPathResolver: function (req) {
      return `/fastlegerest/api${req.url}`;
    },
    proxyErrorHandler: function (err, res, next) {
      console.error("Error in proxy for fastlegerest", err.message);
      next(err);
    },
  })
);

server.use(
  "/ispersonoppgave/api",
  proxy("ispersonoppgave.default", {
    https: false,
    proxyReqPathResolver: function (req) {
      return `/api${req.path}`;
    },
    proxyErrorHandler: function (err, res, next) {
      console.error("Error in proxy for ispersonoppgave", err.message);
      next(err);
    },
  })
);

server.use(
  "/syfo-tilgangskontroll/api",
  proxy("syfo-tilgangskontroll.default", {
    https: false,
    proxyReqPathResolver: function (req) {
      return `/syfo-tilgangskontroll/api${req.url}`;
    },
    proxyErrorHandler: function (err, res, next) {
      console.error("Error in proxy for tilgang", err.message);
      next(err);
    },
  })
);

server.use(
  "/modiacontextholder/api",
  proxy(modiacontextholderUrl, {
    https: false,
    proxyReqPathResolver: function (req) {
      return `/modiacontextholder/api${req.url}`;
    },
    proxyErrorHandler: function (err, res, next) {
      console.error("Error in proxy for modiacontextholder", err.message);
      next(err);
    },
  })
);

server.use(
  "/modiasyforest/api",
  proxy("modiasyforest.default", {
    https: false,
    proxyReqPathResolver: function (req) {
      return `/modiasyforest/api${req.url}`;
    },
    proxyErrorHandler: function (err, res, next) {
      console.error("Error in proxy for modiasyforest", err.message);
      next(err);
    },
  })
);

server.use(
  "/syfooppfolgingsplanservice/api",
  proxy("syfooppfolgingsplanservice.default", {
    https: false,
    proxyReqPathResolver: function (req) {
      return `/syfooppfolgingsplanservice/api${req.url}`;
    },
    proxyErrorHandler: function (err, res, next) {
      console.error(
        "Error in proxy for syfooppfolgingsplanservice",
        err.message
      );
      next(err);
    },
  })
);

server.use(
  "/syfomoteadmin/api",
  proxy("syfomoteadmin.default", {
    https: false,
    proxyReqPathResolver: function (req) {
      return `/syfomoteadmin/api${req.url}`;
    },
    proxyErrorHandler: function (err, res, next) {
      console.error("Error in proxy for syfomoteadmin", err.message);
      next(err);
    },
  })
);

server.use("/veileder/vedtak", cookieParser(), (req, res) => {
  const token = req.cookies["isso-idtoken"];
  const fnr = req.query.fnr;
  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
      fnr,
    },
  };

  const url = `https://${spinnsynBackendVeilederUrl}/api/v1/veileder/vedtak?fnr=${fnr}`;
  axios
    .get(url, options)
    .then((response) => {
      res.send(response.data);
    })
    .catch((err) => {
      console.error("Error in proxy for spinnsyn-backend", err.message);
      res.status(err.status).send(err.message);
    });
});

server.use(
  "/syfomotebehov/api",
  proxy("syfomotebehov.default", {
    https: false,
    proxyReqPathResolver: function (req) {
      return `/syfomotebehov/api${req.url}`;
    },
    proxyErrorHandler: function (err, res, next) {
      console.error("Error in proxy for syfomotebehov", err.message);
      next(err);
    },
  })
);

server.use(
  "/syfotekster/api",
  proxy("syfotekster.default", {
    https: false,
    proxyReqPathResolver: function (req) {
      return `/syfotekster/api${req.path}`;
    },
    proxyErrorHandler: function (err, res, next) {
      console.error("Error in proxy for tekster", err.message);
      next(err);
    },
  })
);

server.use(
  "/syfosoknad/api",
  proxy("syfosoknad.default", {
    https: false,
    proxyReqPathResolver: function (req) {
      return `/syfosoknad/api${req.url}`;
    },
    proxyErrorHandler: function (err, res, next) {
      console.error("Error in proxy for syfosoknad", err.message);
      next(err);
    },
  })
);

server.use(
  "/syfobehandlendeenhet/api",
  proxy("syfobehandlendeenhet.default", {
    https: false,
    proxyReqPathResolver: function (req) {
      return `/api${req.url}`;
    },
    proxyErrorHandler: function (err, res, next) {
      console.error("Error in proxy for syfobehandlendeenhet", err.message);
      next(err);
    },
  })
);

server.use(
  "/syfoperson/api",
  proxy("syfoperson.default", {
    https: false,
    proxyReqPathResolver: function (req) {
      return `/syfoperson/api${req.url}`;
    },
    proxyErrorHandler: function (err, res, next) {
      console.error("Error in proxy for syfoperson", err.message);
      next(err);
    },
  })
);

server.use("/syfosmregister/api", cookieParser(), (req, res) => {
  const token = req.cookies["isso-idtoken"];
  const fnr = req.query.fnr;
  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
      fnr,
    },
  };

  const url = "http://syfosmregister.default/api/v1/internal/sykmeldinger";
  axios
    .get(url, options)
    .then((response) => {
      res.send(response.data);
    })
    .catch((err) => {
      console.error("Error in proxy for syfosmregister", err.message);
      res.status(err.status).send(err.message);
    });
});

server.use("/ispengestopp/api/v1/person/status", cookieParser(), (req, res) => {
  const token = req.cookies["isso-idtoken"];
  const fnr = req.query.fnr;
  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
      fnr,
    },
  };

  axios
    .get(`http://ispengestopp/api/v1/person/status`, options)
    .then((response) => {
      if (response.status === 204) {
        res.sendStatus(204);
      } else {
        res.send(response.data);
      }
    })
    .catch((err) => {
      console.error("Error in proxy for ispengestopp", err.message);
      res.status(err.status).send(err.message);
    });
});

server.use("/ispengestopp/api/v1/person/flagg", cookieParser(), (req, res) => {
  const token = req.cookies["isso-idtoken"];
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const data = req.body;

  axios
    .post(`http://ispengestopp/api/v1/person/flagg`, data, { headers })
    .then((response) => {
      res.sendStatus(response.status);
    })
    .catch((err) => {
      res.status(err.status).send(err.message);
    });
});

server.use("/isprediksjon/api/v1/prediksjon", cookieParser(), (req, res) => {
  const token = req.cookies["isso-idtoken"];
  const fnr = req.query.fnr;
  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
      fnr,
    },
  };

  axios
    .get(`http://isprediksjon/api/v1/prediksjon`, options)
    .then((response) => {
      if (response.status === 204) {
        res.sendStatus(204);
      } else {
        res.send(response.data);
      }
    })
    .catch((err) => {
      console.error("Error in proxy for isprediksjon", err.message);
      res.status(err.status).send(err.message);
    });
});

const port = 8080;

server.listen(port, () => {
  console.log(`App listening on port: ${port}`);
});
