import { ISUTENLANDSOPPHOLD_ROOT } from "@/apiConstants";
import {
  IkkeAktuellArsakDTO,
  SoknadDTO,
  SoknaderResponseDTO,
  SoknadIkkeAktuellPostDTO,
  SoknadIkkeAktuellResponseDTO,
  SoknadStatusDTO,
  SoknadVedtakPostDTO,
  SoknadVedtakResponseDTO,
} from "@/data/utenlandsopphold/utenlandsoppholdTypes";
import { http, HttpResponse } from "msw";
import dayjs from "dayjs";
import { VEILEDER_IDENT_DEFAULT } from "@/mocks/common/mockConstants.ts";

export const soknadUtenVedtakMock: SoknadDTO = {
  soknadId: "1a2b3c4d-5e6f-7890-abcd-ef0987654321",
  eksternId: "e16ff778-8475-47e1-b5dc-d2ce4ad6b9ee",
  status: SoknadStatusDTO.MOTTATT,
  innsendtTidspunkt: "2026-08-18T11:00:00",
  soktePerioder: [
    {
      fom: "2026-09-01",
      tom: "2026-09-07",
    },
    {
      fom: "2026-09-10",
      tom: "2026-09-12",
    },
  ],
  vedtak: null,
  ikkeAktuell: null,
};

export const soknadMedVedtakMock: SoknadDTO = {
  soknadId: "9b1c2d3e-4f56-7890-abcd-ef1234567890",
  eksternId: "1735b402-f937-4958-8aa2-fe36aef70826",
  status: SoknadStatusDTO.INNVILGET,
  innsendtTidspunkt: "2026-08-05T09:00:00",
  soktePerioder: [
    {
      fom: "2026-08-01",
      tom: "2026-08-10",
    },
  ],
  vedtak: {
    utfall: "DELVIS_INNVILGET",
    innvilgedePerioder: [
      {
        fom: "2026-08-01",
        tom: "2026-08-05",
      },
    ],
    fattetAv: "Z990000",
    fattetTidspunkt: "2026-03-02T11:00:00",
    begrunnelse: "Vedtar bare de dagene det er meldt regn på Bali",
  },
  ikkeAktuell: null,
};

export const soknadIkkeAktuellMock: SoknadDTO = {
  soknadId: "5d6e7f8a-9b0c-1d2e-3f4a-5b6c7d8e9f0a",
  eksternId: "c7d8e9f0-1a2b-4c3d-9e8f-7a6b5c4d3e2f",
  status: SoknadStatusDTO.IKKE_AKTUELL,
  innsendtTidspunkt: "2026-08-10T10:00:00",
  soktePerioder: [
    {
      fom: "2026-08-15",
      tom: "2026-08-20",
    },
  ],
  vedtak: null,
  ikkeAktuell: {
    arsak: IkkeAktuellArsakDTO.BEHANDLET_I_INFOTRYGD,
    registrertAv: "Z990000",
    registrertTidspunkt: "2026-08-11T09:00:00",
  },
};

export const gammelSoknadMock: SoknadDTO = {
  soknadId: "3c4d5e6f-7a8b-9012-cdef-345678901234",
  eksternId: "b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e",
  status: SoknadStatusDTO.MOTTATT,
  innsendtTidspunkt: "2026-05-15T08:30:00",
  soktePerioder: [
    {
      fom: "2026-06-01",
      tom: "2026-06-07",
    },
    {
      fom: "2026-06-10",
      tom: "2026-06-12",
    },
  ],
  vedtak: null,
  ikkeAktuell: null,
};

export const mockSoknaderResponse: SoknaderResponseDTO = {
  soknader: [
    soknadUtenVedtakMock,
    gammelSoknadMock,
    soknadMedVedtakMock,
    soknadIkkeAktuellMock,
  ],
};

/**
 * Bygger en oppdatert søknad basert på et innsendt vedtak, slik backend ville
 * gjort det. Delt mellom msw-handleren under (brukt lokalt i dev) og
 * test-stubben i test/stubs/stubIsutenlandsopphold.ts, slik at begge
 * simulerer samme oppførsel når et vedtak fattes.
 */
export function byggOppdatertSoknadMedVedtak(
  soknad: SoknadDTO,
  vedtak: SoknadVedtakPostDTO,
  fattetAv: string,
): SoknadDTO {
  return {
    ...soknad,
    status: (() => {
      switch (vedtak.utfall) {
        case "INNVILGET":
          return SoknadStatusDTO.INNVILGET;
        case "DELVIS_INNVILGET":
          return SoknadStatusDTO.DELVIS_INNVILGET;
        case "HENLAGT":
          return SoknadStatusDTO.HENLAGT;
        default:
          return SoknadStatusDTO.AVSLAG;
      }
    })(),
    vedtak: {
      utfall: vedtak.utfall,
      innvilgedePerioder: vedtak.innvilgedePerioder,
      fattetAv,
      fattetTidspunkt: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
      begrunnelse: vedtak.begrunnelse,
    },
  };
}

/**
 * Bygger en oppdatert søknad basert på en innsendt ikke-aktuell-registrering.
 * Delt mellom msw-handleren under og test-stubben i
 * test/stubs/stubIsutenlandsopphold.ts.
 */
export function byggOppdatertSoknadMedIkkeAktuell(
  soknad: SoknadDTO,
  ikkeAktuell: SoknadIkkeAktuellPostDTO,
  registrertAv: string,
): SoknadDTO {
  return {
    ...soknad,
    status: SoknadStatusDTO.IKKE_AKTUELL,
    ikkeAktuell: {
      arsak: ikkeAktuell.arsak,
      registrertAv,
      registrertTidspunkt: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
    },
  };
}

export const mockIsutenlandsopphold = [
  http.post(`${ISUTENLANDSOPPHOLD_ROOT}/soknader/query`, () => {
    return HttpResponse.json(mockSoknaderResponse);
  }),

  http.post<
    { soknadId: string },
    SoknadVedtakPostDTO,
    SoknadVedtakResponseDTO | string
  >(
    `${ISUTENLANDSOPPHOLD_ROOT}/soknader/:soknadId/vedtak`,
    async ({ request, params }) => {
      const body = await request.json();
      const soknadId = params.soknadId;

      const existingSoknad = mockSoknaderResponse.soknader.find(
        (soknad) => soknad.soknadId === soknadId,
      );

      return existingSoknad
        ? HttpResponse.json({
            soknad: byggOppdatertSoknadMedVedtak(
              existingSoknad,
              body,
              VEILEDER_IDENT_DEFAULT,
            ),
          })
        : HttpResponse.text(`Did not find soknad with uuid ${soknadId}`, {
            status: 400,
          });
    },
  ),

  http.post<
    { soknadId: string },
    SoknadIkkeAktuellPostDTO,
    SoknadIkkeAktuellResponseDTO | string
  >(
    `${ISUTENLANDSOPPHOLD_ROOT}/soknader/:soknadId/ikke-aktuell`,
    async ({ request, params }) => {
      const body = await request.json();
      const soknadId = params.soknadId;

      const existingSoknad = mockSoknaderResponse.soknader.find(
        (soknad) => soknad.soknadId === soknadId,
      );

      return existingSoknad
        ? HttpResponse.json({
            soknad: byggOppdatertSoknadMedIkkeAktuell(
              existingSoknad,
              body,
              VEILEDER_IDENT_DEFAULT,
            ),
          })
        : HttpResponse.text(`Did not find soknad with uuid ${soknadId}`, {
            status: 400,
          });
    },
  ),
];
