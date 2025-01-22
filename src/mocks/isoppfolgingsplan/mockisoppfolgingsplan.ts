import { http, HttpResponse } from "msw";
import { ISOPPFOLGINGSPLAN_ROOT } from "@/apiConstants";
import { VEILEDER_DEFAULT } from "@/mocks/common/mockConstants";
import {
  NewOppfolgingsplanForesporselDTO,
  OppfolgingsplanForesporselResponse,
} from "@/data/oppfolgingsplan/oppfolgingsplanForesporselHooks";

export const mockisoppfolgingsplan = [
  http.get(`${ISOPPFOLGINGSPLAN_ROOT}/oppfolgingsplan/foresporsler`, () => {
    if (existingOppfolgingsplanMock.length == 0) {
      return HttpResponse.json({ error: "Not found" }, { status: 404 });
    } else {
      return HttpResponse.json(existingOppfolgingsplanMock, { status: 200 });
    }
  }),
  http.post<object, NewOppfolgingsplanForesporselDTO>(
    `${ISOPPFOLGINGSPLAN_ROOT}/oppfolgingsplan/foresporsler`,
    async ({ request }) => {
      const body = await request.json();
      const createdForesporsel: OppfolgingsplanForesporselResponse = {
        uuid: "uuid",
        createdAt: new Date(),
        arbeidstakerPersonident: body.arbeidstakerPersonident,
        veilederident: VEILEDER_DEFAULT.ident,
        virksomhetsnummer: body.virksomhetsnummer,
        narmestelederPersonident: body.narmestelederPersonident,
      };
      existingOppfolgingsplanMock.push(createdForesporsel);
      return HttpResponse.json(createdForesporsel, { status: 201 });
    }
  ),
];

export const existingOppfolgingsplanMock: OppfolgingsplanForesporselResponse[] =
  [];
