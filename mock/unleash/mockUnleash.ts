//Enable everything for local development
import { UNLEASH_ROOT } from "../../src/apiConstants";
import { unleashMock } from "./unleashMock";

export const mockUnleash = (server) => {
  server.post(`${UNLEASH_ROOT}/*`, (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(unleashMock));
  });
};
