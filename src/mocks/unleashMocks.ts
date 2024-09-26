import { UNLEASH_ROOT } from "@/apiConstants";
import { ToggleNames } from "@/data/unleash/unleash_types";
import { http, HttpResponse } from "msw";

export const mockUnleashEndpoint = http.get(`${UNLEASH_ROOT}/toggles`, () => {
  return HttpResponse.json(mockUnleashResponse);
});

export const mockUnleashResponse = Object.values(ToggleNames).reduce(
  (accumulator, toggleName) => {
    return { ...accumulator, [toggleName]: true };
  },
  {}
);
