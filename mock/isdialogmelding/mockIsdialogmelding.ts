import { ISDIALOGMELDING_ROOT } from "../../src/apiConstants";
import Auth from "../../server/auth/index.js";
import { behandlereDialogmeldingMock } from "./behandlereDialogmeldingMock";

export const mockIsdialogmelding = (server) => {
  server.get(
    `${ISDIALOGMELDING_ROOT}/behandler/personident`,
    Auth.ensureAuthenticated(),
    (req, res) => {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(behandlereDialogmeldingMock));
    }
  );
};
