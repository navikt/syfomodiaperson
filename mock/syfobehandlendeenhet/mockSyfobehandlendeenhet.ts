import { NAV_PERSONIDENT_HEADER } from "../util/requestUtil";
import { SYFOBEHANDLENDEENHET_ROOT } from "../../src/apiConstants";
import { behandlendeEnhetMock } from "./behandlendeEnhetMock";

import Auth = require("../../server/auth");

export const mockSyfobehandlendeenhet = (server) => {
  server.get(
    `${SYFOBEHANDLENDEENHET_ROOT}/personident`,
    Auth.ensureAuthenticated(),
    (req, res) => {
      if (
        req.headers[NAV_PERSONIDENT_HEADER] &&
        req.headers[NAV_PERSONIDENT_HEADER].length === 11
      ) {
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify(behandlendeEnhetMock));
      } else {
        res.status(400).send("Did not find PersonIdent in headers");
      }
    }
  );
};
