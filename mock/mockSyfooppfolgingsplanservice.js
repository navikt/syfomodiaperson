const path = require("path");

const mockData = require("./mockData");
const enums = require("./mockDataEnums");

const mockOppfolgingsplan = require("./oppfolgingsplan/mockOppfolgingsplan");
const mockOppfolgingsplanLPS = require("./oppfolgingsplan/mockOppfolgingsplanLPS");

const NAV_PERSONIDENT_HEADER = "nav-personident";

const dokumentinfo = { antallSider: 4 };

function mockForLokal(server) {
  server.get(
    "/syfooppfolgingsplanservice/api/internad/v1/oppfolgingsplan/:fnr",
    (req, res) => {
      res.setHeader("Content-Type", "application/json");
      res.send(mockOppfolgingsplan.getOppfolgingsplaner());
    }
  );

  server.get(
    "/syfooppfolgingsplanservice/api/internad/v1/oppfolgingsplan/:fnr/historikk",
    (req, res) => {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(mockData[enums.HISTORIKKOPPFOLGINGSPLAN]));
    }
  );

  server.get(
    "/syfooppfolgingsplanservice/api/internad/dokument/:id/dokumentinfo",
    (req, res) => {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(dokumentinfo));
    }
  );

  server.get(
    "/syfooppfolgingsplanservice/api/internad/oppfolgingsplan/lps",
    (req, res) => {
      if (
        req.headers[NAV_PERSONIDENT_HEADER] &&
        req.headers[NAV_PERSONIDENT_HEADER].length === 11
      ) {
        res.setHeader("Content-Type", "application/json");
        res.send(
          JSON.stringify(mockOppfolgingsplanLPS.getOppfolgingsplanerLPS())
        );
      } else {
        res.status(400).send();
      }
    }
  );

  server.get(
    "/syfooppfolgingsplanservice/api/internad/dokument/lps/:uuid",
    (req, res) => {
      const file = path.join(
        __dirname,
        "/oppfolgingsplan/pdf/oppfolgingsplanlps.pdf"
      );
      res.download(file, function (err) {
        if (err) {
          res.status(500).send("Error");
        }
      });
    }
  );
}

function mockSyfooppfolgingsplanservice(server) {
  mockForLokal(server);
}

module.exports = mockSyfooppfolgingsplanservice;
