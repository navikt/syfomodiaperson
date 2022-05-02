import { ToggleNames } from "../../src/data/unleash/unleash_types";

export const unleashMock = Object.values(ToggleNames).reduce(
  (accumulator, toggleName) => {
    return { ...accumulator, [toggleName]: true };
  },
  {}
);
