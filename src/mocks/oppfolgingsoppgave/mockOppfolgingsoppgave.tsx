import { ISHUSKELAPP_ROOT } from "@/apiConstants";
import {
  EditOppfolgingsoppgaveRequestDTO,
  OppfolgingsoppgaveRequestDTO,
  OppfolgingsoppgaveResponseDTO,
  OppfolgingsoppgaveVersjonResponseDTO,
} from "@/data/oppfolgingsoppgave/types";
import { generateUUID } from "@/utils/uuidUtils";
import { VEILEDER_IDENT_DEFAULT } from "../common/mockConstants";
import { http, HttpResponse } from "msw";
import {
  historikkOppfolgingsoppgaveAktivMock,
  historikkOppfolgingsoppgaveFjernetMock,
} from "@/mocks/oppfolgingsoppgave/historikkOppfolgingsoppgaveMock";

let oppfolgingsoppgaverMock: OppfolgingsoppgaveResponseDTO[] = [
  historikkOppfolgingsoppgaveAktivMock,
  historikkOppfolgingsoppgaveFjernetMock,
];
const oppfolgingsoppgaveUuid = generateUUID();

export const mockIshuskelapp = [
  http.get(`${ISHUSKELAPP_ROOT}/huskelapp`, ({ request }) => {
    if (request.url.includes("?isActive=true")) {
      if (oppfolgingsoppgaverMock[0].isActive) {
        return HttpResponse.json(oppfolgingsoppgaverMock[0]);
      } else {
        return new HttpResponse(null, { status: 204 });
      }
    } else if (request.url.includes("?filter=all")) {
      return HttpResponse.json(oppfolgingsoppgaverMock);
    } else {
      return new HttpResponse(null, { status: 500 });
    }
  }),
  http.post<object, EditOppfolgingsoppgaveRequestDTO>(
    `${ISHUSKELAPP_ROOT}/huskelapp/:huskelappUuid`,
    async ({ request, params }) => {
      const body = await request.json();
      const huskelappUuid = params["huskelappUuid"];

      oppfolgingsoppgaverMock = oppfolgingsoppgaverMock.map((oppgave) =>
        oppgave.uuid === huskelappUuid
          ? {
              ...oppgave,
              versjoner: [
                {
                  uuid: generateUUID(),
                  createdAt: new Date(),
                  createdBy: VEILEDER_IDENT_DEFAULT,
                  oppfolgingsgrunn: oppgave.versjoner[0].oppfolgingsgrunn,
                  tekst: body.tekst,
                  frist: body.frist,
                } as OppfolgingsoppgaveVersjonResponseDTO,
                ...oppgave.versjoner,
              ],
            }
          : oppgave
      );

      HttpResponse.json(oppfolgingsoppgaverMock[0]);
    }
  ),
  http.post<object, OppfolgingsoppgaveRequestDTO>(
    `${ISHUSKELAPP_ROOT}/huskelapp`,
    async ({ request }) => {
      const body = await request.json();
      oppfolgingsoppgaverMock = oppfolgingsoppgaverMock = [
        {
          uuid: oppfolgingsoppgaveUuid,
          updatedAt: new Date(),
          createdAt: new Date(),
          isActive: true,
          removedBy: null,
          versjoner: [
            {
              uuid: generateUUID(),
              createdAt: new Date(),
              createdBy: VEILEDER_IDENT_DEFAULT,
              oppfolgingsgrunn: body.oppfolgingsgrunn,
              tekst: body.tekst,
              frist: body.frist,
            } as OppfolgingsoppgaveVersjonResponseDTO,
          ],
        },
        ...oppfolgingsoppgaverMock,
      ];

      return new HttpResponse(null, { status: 200 });
    }
  ),
  http.delete(`${ISHUSKELAPP_ROOT}/huskelapp/:huskelappUuid`, ({ params }) => {
    oppfolgingsoppgaverMock = oppfolgingsoppgaverMock.map((oppgave) =>
      oppgave.uuid === params.huskelappUuid
        ? {
            ...oppgave,
            isActive: false,
            removedBy: VEILEDER_IDENT_DEFAULT,
            updatedAt: new Date(),
          }
        : oppgave
    );
    return new HttpResponse(null, { status: 204 });
  }),
];
