import { ISDIALOGMOTEKANDIDAT_ROOT } from "@/apiConstants";
import { http, HttpResponse } from "msw";
import { VEILEDER_IDENT_DEFAULT } from "@/mocks/common/mockConstants";
import {
  dialogmoteikkeaktuellMock,
  dialogmoteunntakMock,
} from "@/mocks/isdialogmotekandidat/dialogmotebehovvurderingerMock";
import { dialogmotekandidatMock } from "@/mocks/isdialogmotekandidat/dialogmotekandidatMock";

let avventMock: {
  frist: string;
  createdBy: string;
  beskrivelse: string | null;
}[] = [];

export const mockIsdialogmotekandidat = [
  http.get(`${ISDIALOGMOTEKANDIDAT_ROOT}/kandidat/personident`, () => {
    return HttpResponse.json(dialogmotekandidatMock);
  }),
  http.get(`${ISDIALOGMOTEKANDIDAT_ROOT}/kandidat/historikk`, () => {
    return HttpResponse.json([
      {
        tidspunkt: "2019-04-15T00:00:00",
        type: "KANDIDAT",
        vurdertAv: null,
      },
      {
        tidspunkt: "2019-04-20T00:00:00",
        type: "UNNTAK",
        vurdertAv: VEILEDER_IDENT_DEFAULT,
      },
    ]);
  }),
  http.get(`${ISDIALOGMOTEKANDIDAT_ROOT}/unntak/personident`, () => {
    return HttpResponse.json(dialogmoteunntakMock);
  }),
  http.post(`${ISDIALOGMOTEKANDIDAT_ROOT}/unntak/personident`, () => {
    return new HttpResponse(null, { status: 200 });
  }),
  http.get(`${ISDIALOGMOTEKANDIDAT_ROOT}/ikkeaktuell/personident`, () => {
    return HttpResponse.json(dialogmoteikkeaktuellMock);
  }),
  http.post(
    `${ISDIALOGMOTEKANDIDAT_ROOT}/avvent/personident`,
    async ({ request }) => {
      const body = (await request.json()) as {
        personIdent: string;
        frist: string;
        beskrivelse?: string;
      };

      const nyAvvent = {
        frist: body.frist,
        createdBy: VEILEDER_IDENT_DEFAULT,
        beskrivelse: body.beskrivelse ?? null,
      };

      avventMock = [nyAvvent, ...avventMock];

      return HttpResponse.json(nyAvvent, { status: 200 });
    }
  ),
  http.get(`${ISDIALOGMOTEKANDIDAT_ROOT}/avvent/personident`, () => {
    return HttpResponse.json(avventMock);
  }),
  http.post(
    `${ISDIALOGMOTEKANDIDAT_ROOT}/avvent/personident`,
    async ({ request }) => {
      const body = (await request.json()) as {
        personIdent: string;
        frist: string;
        beskrivelse?: string;
      };

      const nyAvvent = {
        frist: body.frist,
        createdBy: VEILEDER_IDENT_DEFAULT,
        beskrivelse: body.beskrivelse ?? null,
      };

      // Legg den nyeste først i lista
      avventMock = [nyAvvent, ...avventMock];

      return HttpResponse.json(nyAvvent, { status: 200 });
    }
  ),
];
