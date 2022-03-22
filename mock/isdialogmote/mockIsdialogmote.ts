import { NAV_PERSONIDENT_HEADER } from "../util/requestUtil";
import { dialogmoterMock } from "../data/dialogmoterMock";
import { ISDIALOGMOTE_ROOT } from "../../src/apiConstants";

const Auth = require("../../server/auth/index.js");

export const mockIsdialogmote = (server) => {
  server.post(
    `${ISDIALOGMOTE_ROOT}/dialogmote/personident`,
    Auth.ensureAuthenticated(),
    (req, res) => {
      if (
        req.headers[NAV_PERSONIDENT_HEADER] &&
        req.headers[NAV_PERSONIDENT_HEADER].length === 11
      ) {
        res.sendStatus(200);
      } else {
        res.status(400).send("Did not find PersonIdent in headers");
      }
    }
  );
  server.get(
    `${ISDIALOGMOTE_ROOT}/dialogmote/personident`,
    Auth.ensureAuthenticated(),
    (req, res) => {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(dialogmoterMock));
    }
  );

  server.post(
    `${ISDIALOGMOTE_ROOT}/dialogmote/:moteuuid/avlys`,
    Auth.ensureAuthenticated(),
    (req, res) => {
      const { moteuuid } = req.params;
      const dialogmoteToUpdate = dialogmoterMock.find(
        (dialogmote) => dialogmote.uuid === moteuuid
      );
      dialogmoteToUpdate!!.status = "AVLYST";
      res.sendStatus(200);
    }
  );

  server.post(
    `${ISDIALOGMOTE_ROOT}/dialogmote/:moteuuid/tidsted`,
    Auth.ensureAuthenticated(),
    (req, res) => {
      res.sendStatus(200);
    }
  );

  server.post(
    `${ISDIALOGMOTE_ROOT}/dialogmote/:moteuuid/ferdigstill`,
    Auth.ensureAuthenticated(),
    (req, res) => {
      const { moteuuid } = req.params;
      const dialogmoteToUpdate = dialogmoterMock.find(
        (dialogmote) => dialogmote.uuid === moteuuid
      );
      dialogmoteToUpdate!!.status = "FERDIGSTILT";
      res.sendStatus(200);
    }
  );

  server.post(
    `${ISDIALOGMOTE_ROOT}/dialogmote/:moteuuid/endreferdigstilt`,
    Auth.ensureAuthenticated(),
    (req, res) => {
      res.sendStatus(200);
    }
  );
};
