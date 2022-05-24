import express = require("express");
import { NAV_PERSONIDENT_HEADER } from "../util/requestUtil";
import { personAdresseMock } from "./personAdresseMock";
import { brukerinfoMock } from "./brukerinfoMock";
import { SYFOPERSON_ROOT } from "../../src/apiConstants";

import Auth = require("../../server/auth");

const diskresjonskode = "7";
const isEgenAnsatt = true;

export const mockSyfoperson = (server: any) => {
  server.get(
    `${SYFOPERSON_ROOT}/person/diskresjonskode`,
    Auth.ensureAuthenticated(),
    (req: express.Request, res: express.Response) => {
      if (req.headers[NAV_PERSONIDENT_HEADER]?.length === 11) {
        res.setHeader("Content-Type", "application/json");
        res.send(diskresjonskode);
      } else {
        res.status(400).send("Did not find PersonIdent in headers");
      }
    }
  );

  server.get(
    `${SYFOPERSON_ROOT}/person/egenansatt`,
    Auth.ensureAuthenticated(),
    (req: express.Request, res: express.Response) => {
      if (req.headers[NAV_PERSONIDENT_HEADER]?.length === 11) {
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify(isEgenAnsatt));
      } else {
        res.status(400).send("Did not find PersonIdent in headers");
      }
    }
  );

  server.get(
    `${SYFOPERSON_ROOT}/person/adresse`,
    Auth.ensureAuthenticated(),
    (req: express.Request, res: express.Response) => {
      if (req.headers[NAV_PERSONIDENT_HEADER]?.length === 11) {
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify(personAdresseMock));
      } else {
        res.status(400).send("Did not find PersonIdent in headers");
      }
    }
  );

  server.get(
    `${SYFOPERSON_ROOT}/person/brukerinfo`,
    Auth.ensureAuthenticated(),
    (req: express.Request, res: express.Response) => {
      if (req.headers[NAV_PERSONIDENT_HEADER]?.length === 11) {
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify(brukerinfoMock));
      } else {
        res.status(400).send("Did not find PersonIdent in headers");
      }
    }
  );
};
