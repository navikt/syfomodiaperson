import { setupWorker } from "msw/browser";
import handlers from "@/mocks/handlers";
import { getVignettHandlers } from "@/mocks/vignetter/vignettMocks";

export const worker = setupWorker(
  ...getVignettHandlers(window.location.search),
  ...handlers,
);
