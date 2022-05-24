import express = require("express");
import { UNLEASH_ROOT } from "../../src/apiConstants";
import { unleashMock } from "./unleashMock";

//Enable everything for local development
export const mockUnleash = (server: any) => {
  server.post(
    `${UNLEASH_ROOT}/*`,
    (req: express.Request, res: express.Response) => {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(unleashMock));
    }
  );
};
