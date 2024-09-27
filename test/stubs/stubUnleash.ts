import { UNLEASH_ROOT } from "@/apiConstants";
import { mockUnleashResponse } from "@/mocks/unleashMocks";
import { mockServer } from "../setup";
import { http, HttpResponse } from "msw";

export const stubFeatureTogglesApi = () =>
  mockServer.use(
    http.get(`*${UNLEASH_ROOT}/toggles`, () =>
      HttpResponse.json(mockUnleashResponse)
    )
  );
