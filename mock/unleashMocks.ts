import { UNLEASH_ROOT } from "../src/apiConstants";
import express from "express";
import { ToggleNames } from "../src/data/unleash/unleash_types";

export const mockUnleashEndpoint = (server: any) => {
  server.get(
    `${UNLEASH_ROOT}/toggles`,
    (req: express.Request, res: express.Response) => {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(mockUnleashResponse));
    }
  );
};

export const mockUnleashResponse = Object.values(ToggleNames).reduce(
  (accumulator, toggleName) => {
    return { ...accumulator, [toggleName]: true };
  },
  {}
);
