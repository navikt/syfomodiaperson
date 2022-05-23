import { fastlegerMock } from "./fastlegerMock";
import { FASTLEGEREST_ROOT } from "../../src/apiConstants";

import Auth = require("../../server/auth");

export const mockFastlegerest = (server) => {
  server.get(
    `${FASTLEGEREST_ROOT}/fastleger`,
    Auth.ensureAuthenticated(),
    (req, res) => {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(fastlegerMock));
    }
  );
};
