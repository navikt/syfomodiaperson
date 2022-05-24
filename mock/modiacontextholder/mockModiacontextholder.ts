import express = require("express");
import { MODIACONTEXTHOLDER_ROOT } from "../../src/apiConstants";
import {
  ARBEIDSTAKER_DEFAULT,
  ENHET_GAMLEOSLO,
  ENHET_GRUNERLOKKA,
  VEILEDER_IDENT_DEFAULT,
} from "../common/mockConstants";

import Auth = require("../../server/auth");

const saksbehandler = {
  ident: VEILEDER_IDENT_DEFAULT,
  navn: "Vetle Veileder",
  fornavn: "Vetle",
  etternavn: "Veileder",
  enheter: [
    {
      enhetId: ENHET_GRUNERLOKKA.nummer,
      navn: ENHET_GRUNERLOKKA.navn,
    },
    {
      enhetId: ENHET_GAMLEOSLO.nummer,
      navn: ENHET_GAMLEOSLO.navn,
    },
  ],
};

const aktivBruker = {
  aktivBruker: ARBEIDSTAKER_DEFAULT.personIdent,
  aktivEnhet: null,
};

const aktivEnhet = {
  aktivBruker: null,
  aktivEnhet: ENHET_GRUNERLOKKA.nummer,
};

export const mockModiacontextholder = (server: any) => {
  server.get(
    `${MODIACONTEXTHOLDER_ROOT}/decorator`,
    Auth.ensureAuthenticated(),
    (req: express.Request, res: express.Response) => {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(saksbehandler));
    }
  );

  server.get(
    `${MODIACONTEXTHOLDER_ROOT}/context/aktivbruker`,
    Auth.ensureAuthenticated(),
    (req: express.Request, res: express.Response) => {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(aktivBruker));
    }
  );

  server.get(
    `${MODIACONTEXTHOLDER_ROOT}/context/aktivenhet`,
    Auth.ensureAuthenticated(),
    (req: express.Request, res: express.Response) => {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(aktivEnhet));
    }
  );

  server.post(
    `${MODIACONTEXTHOLDER_ROOT}/context`,
    Auth.ensureAuthenticated(),
    (req: express.Request, res: express.Response) => {
      res.send().status(204);
    }
  );
};
