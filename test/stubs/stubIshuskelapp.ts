import { ISHUSKELAPP_ROOT } from "@/apiConstants";
import { OppfolgingsoppgaveResponseDTO } from "@/data/oppfolgingsoppgave/types";
import { mockServer } from "../setup";
import { http, HttpResponse } from "msw";

export const stubOppfolgingsoppgaveApi = (
  oppfolgingsoppgave: OppfolgingsoppgaveResponseDTO | undefined
) =>
  mockServer.use(
    http.get(`*${ISHUSKELAPP_ROOT}/huskelapp`, ({ request }) =>
      request.url.includes("?isActive=true")
        ? HttpResponse.json(oppfolgingsoppgave)
        : HttpResponse.json(null)
    )
  );
