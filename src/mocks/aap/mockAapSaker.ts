import { http, HttpResponse } from "msw";
import { SYFOPERSON_ROOT } from "@/apiConstants";
import {
  AapSoknadDTO,
  AapStatusDTO,
  AapVedtakPeriodeDTO,
} from "@/data/aap/aapTypes";

export const mockAapSaker = http.post(
  `${SYFOPERSON_ROOT}/person/aap-saker/query`,
  () => {
    return HttpResponse.json(mockAapStatus);
  },
);

interface AapStatusMockOptions {
  soknad?: Pick<AapSoknadDTO, "statuskode" | "erAktiv">;
  vedtak?: {
    perioder: AapVedtakPeriodeDTO[];
    erAktivt: boolean;
  };
}

export function createAapStatusMock({
  soknad,
  vedtak,
}: AapStatusMockOptions = {}): AapStatusDTO {
  return {
    soknader: soknad
      ? [
          {
            sakid: "mock-sak",
            soknadsdatoer: ["2026-01-01"],
            ...soknad,
          },
        ]
      : [],
    vedtak: vedtak
      ? [
          {
            sakid: "mock-sak",
            kilde: "KELVIN",
            vedtaksdato: "2026-01-01",
            ...vedtak,
          },
        ]
      : [],
  };
}

export const mockAapStatus = createAapStatusMock({
  soknad: {
    statuskode: "UNDER_BEHANDLING",
    erAktiv: true,
  },
  vedtak: {
    perioder: [
      {
        fraOgMedDato: "2024-01-01",
        tilOgMedDato: "2026-05-01",
      },
    ],
    erAktivt: false,
  },
});
