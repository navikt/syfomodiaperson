import { ISDIALOGMOTEKANDIDAT_ROOT } from "../../src/apiConstants";
import { NAV_PERSONIDENT_HEADER } from "../util/requestUtil";
import { dialogmotekandidatMock } from "./dialogmotekandidatMock";
import { dialogmoteunntakMock } from "./dialogmoteunntakMock";

import Auth = require("../../server/auth");

export const mockIsdialogmotekandidat = (server) => {
  server.get(
    `${ISDIALOGMOTEKANDIDAT_ROOT}/kandidat/personident`,
    Auth.ensureAuthenticated(),
    (req, res) => {
      if (
        req.headers[NAV_PERSONIDENT_HEADER] &&
        req.headers[NAV_PERSONIDENT_HEADER].length === 11
      ) {
        res.send(JSON.stringify(dialogmotekandidatMock));
      } else {
        res.status(400).send("Did not find PersonIdent in headers");
      }
    }
  );
  server.get(
    `${ISDIALOGMOTEKANDIDAT_ROOT}/unntak/personident`,
    Auth.ensureAuthenticated(),
    (req, res) => {
      if (
        req.headers[NAV_PERSONIDENT_HEADER] &&
        req.headers[NAV_PERSONIDENT_HEADER].length === 11
      ) {
        res.send(JSON.stringify(dialogmoteunntakMock));
      } else {
        res.status(400).send("Did not find PersonIdent in headers");
      }
    }
  );
  server.post(
    `${ISDIALOGMOTEKANDIDAT_ROOT}/unntak/personident`,
    Auth.ensureAuthenticated(),
    (req, res) => {
      res.sendStatus(200);
    }
  );
};
