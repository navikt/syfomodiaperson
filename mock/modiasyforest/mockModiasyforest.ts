import { oppfolgingstilfelleperioderMock } from "../data/oppfolgingstilfelleperioderMock";
import { MODIASYFOREST_ROOT } from "../../src/apiConstants";

const Auth = require("../../server/auth/index.js");

export const mockModiasyforest = (server) => {
  server.get(
    `${MODIASYFOREST_ROOT}/oppfolgingstilfelleperioder`,
    Auth.ensureAuthenticated(),
    (req, res) => {
      const { orgnummer } = req.query;
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(oppfolgingstilfelleperioderMock[orgnummer]));
    }
  );
};
