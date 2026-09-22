import { ISUTENLANDSOPPHOLD_ROOT } from "@/apiConstants";
import {
  IkkeAktuellArsakDTO,
  SoknadDTO,
  SoknaderResponseDTO,
  SoknadHenleggelsePostDTO,
  SoknadIkkeAktuellPostDTO,
  SoknadResponseDTO,
  SoknadStatusDTO,
  SoknadVedtakPostDTO,
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
  behandling: null,
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
  behandling: {
    utfall: "DELVIS_INNVILGET",
    innvilgedePerioder: [
      {
        fom: "2026-08-01",
        tom: "2026-08-05",
      },
    ],
    behandletAv: "Z990000",
    behandletTidspunkt: "2026-03-02T11:00:00",
    begrunnelse: "Vedtar bare de dagene det er meldt regn på Bali",
  },
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
  behandling: {
    utfall: "IKKE_AKTUELL",
    ikkeAktuellArsak: IkkeAktuellArsakDTO.BEHANDLET_I_INFOTRYGD,
    behandletAv: "Z990000",
    behandletTidspunkt: "2026-08-11T09:00:00",
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
  behandling: null,
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
  behandletAv: string,
): SoknadDTO {
  const behandletTidspunkt = dayjs().format("YYYY-MM-DDTHH:mm:ss");
  switch (vedtak.utfall) {
    case "INNVILGET":
      return {
        ...soknad,
        status: SoknadStatusDTO.INNVILGET,
        behandling: {
          utfall: "INNVILGET",
          innvilgedePerioder: vedtak.innvilgedePerioder,
          behandletAv,
          behandletTidspunkt,
        },
      };
    case "DELVIS_INNVILGET":
      return {
        ...soknad,
        status: SoknadStatusDTO.DELVIS_INNVILGET,
        behandling: {
          utfall: "DELVIS_INNVILGET",
          innvilgedePerioder: vedtak.innvilgedePerioder,
          behandletAv,
          behandletTidspunkt,
          begrunnelse: vedtak.begrunnelse ?? "",
        },
      };
    case "AVSLAG":
      return {
        ...soknad,
        status: SoknadStatusDTO.AVSLAG,
        behandling: {
          utfall: "AVSLAG",
          behandletAv,
          behandletTidspunkt,
          begrunnelse: vedtak.begrunnelse ?? "",
        },
      };
  }
}

/**
 * Bygger en oppdatert søknad basert på en innsendt henleggelse. Delt mellom
 * msw-handleren under og test-stubben i test/stubs/stubIsutenlandsopphold.ts.
 */
export function byggOppdatertSoknadMedHenleggelse(
  soknad: SoknadDTO,
  henleggelse: SoknadHenleggelsePostDTO,
  behandletAv: string,
): SoknadDTO {
  return {
    ...soknad,
    status: SoknadStatusDTO.HENLAGT,
    behandling: {
      utfall: "HENLAGT",
      behandletAv,
      behandletTidspunkt: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
      begrunnelse: henleggelse.begrunnelse,
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
  behandletAv: string,
): SoknadDTO {
  return {
    ...soknad,
    status: SoknadStatusDTO.IKKE_AKTUELL,
    behandling: {
      utfall: "IKKE_AKTUELL",
      ikkeAktuellArsak: ikkeAktuell.arsak,
      behandletAv,
      behandletTidspunkt: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
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
    SoknadResponseDTO | string
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
    SoknadHenleggelsePostDTO,
    SoknadResponseDTO | string
  >(
    `${ISUTENLANDSOPPHOLD_ROOT}/soknader/:soknadId/henleggelse`,
    async ({ request, params }) => {
      const body = await request.json();
      const soknadId = params.soknadId;

      const existingSoknad = mockSoknaderResponse.soknader.find(
        (soknad) => soknad.soknadId === soknadId,
      );

      return existingSoknad
        ? HttpResponse.json({
            soknad: byggOppdatertSoknadMedHenleggelse(
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
    SoknadResponseDTO | string
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
