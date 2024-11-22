import { ISHUSKELAPP_ROOT } from "@/apiConstants";
import {
  EditOppfolgingsoppgaveRequestDTO,
  OppfolgingsoppgaveRequestDTO,
  OppfolgingsoppgaveResponseDTO,
} from "@/data/oppfolgingsoppgave/types";
import { generateUUID } from "@/utils/uuidUtils";
import { VEILEDER_IDENT_DEFAULT } from "../common/mockConstants";
import { http, HttpResponse } from "msw";
import {
  historikkOppfolgingsoppgaveAktivMock,
  historikkOppfolgingsoppgaveFjernetMock,
} from "@/mocks/oppfolgingsoppgave/historikkOppfolgingsoppgaveMock";

let oppfolgingsoppgaveMock: OppfolgingsoppgaveResponseDTO | undefined =
  undefined;
const oppfolgingsoppgaveUuid = generateUUID();

export const mockIshuskelapp = [
  http.get(`${ISHUSKELAPP_ROOT}/huskelapp?filter=all`, () => {
    return HttpResponse.json([
      historikkOppfolgingsoppgaveAktivMock,
      historikkOppfolgingsoppgaveFjernetMock,
    ]);
  }),
  http.get(`${ISHUSKELAPP_ROOT}/huskelapp`, () => {
    return !!oppfolgingsoppgaveMock
      ? HttpResponse.json(oppfolgingsoppgaveMock)
      : new HttpResponse(null, { status: 204 });
  }),
  http.post<object, EditOppfolgingsoppgaveRequestDTO>(
    `${ISHUSKELAPP_ROOT}/huskelapp/:huskelappUuid`,
    async ({ request }) => {
      const body = await request.json();
      if (oppfolgingsoppgaveMock) {
        oppfolgingsoppgaveMock = {
          uuid: oppfolgingsoppgaveMock.uuid,
          createdBy: oppfolgingsoppgaveMock.createdBy,
          updatedAt: oppfolgingsoppgaveMock.updatedAt,
          createdAt: oppfolgingsoppgaveMock.createdAt,
          oppfolgingsgrunn: oppfolgingsoppgaveMock.oppfolgingsgrunn,
          tekst: body.tekst,
          frist: body.frist,
        };
        return HttpResponse.json(oppfolgingsoppgaveMock);
      } else {
        return new HttpResponse(null, { status: 500 });
      }
    }
  ),
  http.post<object, OppfolgingsoppgaveRequestDTO>(
    `${ISHUSKELAPP_ROOT}/huskelapp`,
    async ({ request }) => {
      const body = await request.json();
      oppfolgingsoppgaveMock = {
        uuid: oppfolgingsoppgaveUuid,
        createdBy: VEILEDER_IDENT_DEFAULT,
        updatedAt: new Date(),
        createdAt: new Date(),
        oppfolgingsgrunn: body.oppfolgingsgrunn,
        tekst: body.tekst,
        frist: body.frist,
      };
      return new HttpResponse(null, { status: 200 });
    }
  ),
  http.delete(`${ISHUSKELAPP_ROOT}/huskelapp/:huskelappUuid`, () => {
    oppfolgingsoppgaveMock = undefined;
    return new HttpResponse(null, { status: 204 });
  }),
];
