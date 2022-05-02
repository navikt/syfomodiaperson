//Enable everything for local development
import { UNLEASH_ROOT } from "../../src/apiConstants";
import { ToggleNames } from "../../src/data/unleash/unleash_types";

export const mockUnleash = (server) => {
  const unleashToggles = Object.values(ToggleNames).reduce(
    (accumulator, toggleName) => {
      return { ...accumulator, [toggleName]: true };
    },
    {}
  );

  server.post(`${UNLEASH_ROOT}/*`, (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(unleashToggles));
  });
};
