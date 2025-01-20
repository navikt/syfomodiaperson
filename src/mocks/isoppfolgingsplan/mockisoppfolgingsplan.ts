import { http, HttpResponse } from "msw";
import { ISOPPFOLGINGSPLAN_ROOT } from "@/apiConstants";
import { VEILEDER_DEFAULT } from "@/mocks/common/mockConstants";
import {
  NewOppfolgingsplanForesporselDTO,
  OppfolgingsplanForesporselResponse,
} from "@/data/oppfolgingsplan/oppfolgingsplanForesporselHooks";

export const mockisoppfolgingsplan = [
  http.get(`${ISOPPFOLGINGSPLAN_ROOT}/oppfolgingsplan/foresporsler`, () => {
    return HttpResponse.json(existingOppfolgingsplanMock);
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
      return HttpResponse.json(createdForesporsel, { status: 201 });
    }
  ),
];

export const existingOppfolgingsplanMock: OppfolgingsplanForesporselResponse[] =
  [
    {
      uuid: "uuid",
      createdAt: new Date(),
      arbeidstakerPersonident: "12345678910",
      veilederident: "12345678910",
      virksomhetsnummer: "12345678910",
      narmestelederPersonident: "12345678910",
    },
  ];
