//Enable everything for local development
import { UNLEASH_ROOT } from "../../src/apiConstants";

export const mockUnleash = (server) => {
  server.post(`${UNLEASH_ROOT}/*`, (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(
      JSON.stringify({
        "syfo.syfomodiaperson.sykmeldingsgrad": true,
      })
    );
  });
};
