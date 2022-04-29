import { oppfolgingsplanMock } from "./oppfolgingsplanMock";
import { historikkoppfolgingsplanMock } from "../data/historikkoppfolgingsplanMock";
import { oppfolgingsplanerLPSMock } from "./oppfolgingsplanLPSMock";
import { NAV_PERSONIDENT_HEADER } from "../util/requestUtil";
import { SYFOOPPFOLGINGSPLANSERVICE_ROOT } from "../../src/apiConstants";
import { dokumentinfoMock } from "../data/dokumentinfoMock";

const path = require("path");

const Auth = require("../../server/auth/index.js");

export const mockSyfooppfolgingsplanservice = (server) => {
  server.get(
    `${SYFOOPPFOLGINGSPLANSERVICE_ROOT}/oppfolgingsplan/lps`,
    Auth.ensureAuthenticated(),
    (req, res) => {
      if (
        req.headers[NAV_PERSONIDENT_HEADER] &&
        req.headers[NAV_PERSONIDENT_HEADER].length === 11
      ) {
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify(oppfolgingsplanerLPSMock(new Date())));
      } else {
        res.status(400).send();
      }
    }
  );

  server.get(
    `${SYFOOPPFOLGINGSPLANSERVICE_ROOT}/dokument/lps/:uuid`,
    Auth.ensureAuthenticated(),
    (req, res) => {
      const file = path.join(
        __dirname,
        "/oppfolgingsplan/pdf/oppfolgingsplanlps.pdf"
      );
      res.download(file, (err) => {
        if (err) {
          res.status(500).send("Error");
        }
      });
    }
  );

  server.get(
    `${SYFOOPPFOLGINGSPLANSERVICE_ROOT}/oppfolgingsplan/:fnr`,
    Auth.ensureAuthenticated(),
    (req, res) => {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(oppfolgingsplanMock));
    }
  );

  server.get(
    `${SYFOOPPFOLGINGSPLANSERVICE_ROOT}/oppfolgingsplan/:fnr/historikk`,
    Auth.ensureAuthenticated(),
    (req, res) => {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(historikkoppfolgingsplanMock));
    }
  );

  server.get(
    `${SYFOOPPFOLGINGSPLANSERVICE_ROOT}/dokument/:id/dokumentinfo`,
    Auth.ensureAuthenticated(),
    (req, res) => {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(dokumentinfoMock));
    }
  );
};
