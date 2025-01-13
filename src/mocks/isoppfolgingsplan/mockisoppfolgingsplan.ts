import { http, HttpResponse } from "msw";
import { ISOPPFOLGINGSPLAN_ROOT } from "@/apiConstants";
import {
  ExistingOppfolgingsplanForesporselDTO,
  NewOppfolgingsplanForesporselDTO,
} from "@/data/oppfolgingsplan/oppfolgingsplanQueryHooks";

export const mockisoppfolgingsplan = [
  http.get(`${ISOPPFOLGINGSPLAN_ROOT}/oppfolgingsplan/foresporsler`, () => {
    return HttpResponse.json(existingOppfolgingsplanMock);
  }),
  http.post<object, NewOppfolgingsplanForesporselDTO>(
    `${ISOPPFOLGINGSPLAN_ROOT}/oppfolgingsplan/foresporsler`,
    async ({ request }) => {
      const body = await request.json();
      const newForesporsel: ExistingOppfolgingsplanForesporselDTO = {
        uuid: "uuid",
        createdAt: new Date(),
        arbeidstakerPersonident: body.arbeidstakerPersonident,
        veilederident: body.veilederident,
        virksomhetsnummer: body.virksomhetsnummer,
        narmestelederPersonident: body.narmestelederPersonident,
      };
      return HttpResponse.json(newForesporsel, { status: 201 });
    }
  ),
];

export const existingOppfolgingsplanMock: ExistingOppfolgingsplanForesporselDTO[] =
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
