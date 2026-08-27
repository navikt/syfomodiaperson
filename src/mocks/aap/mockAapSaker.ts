import { http, HttpResponse } from "msw";
import { SYFOPERSON_ROOT } from "@/apiConstants";
import { AapStatusDTO } from "@/data/aap/aapTypes";

export const mockAapSaker = http.post(
  `${SYFOPERSON_ROOT}/person/aap-saker/query`,
  () => {
    return HttpResponse.json(mockAapStatus);
  },
);

export const mockAapStatus: AapStatusDTO = {
  soknader: [
    {
      sakid: "1",
      soknadsdatoer: ["2024-01-05"],
      statuskode: "UNDER_BEHANDLING",
      erAktiv: true,
    },
  ],
  vedtak: [
    {
      sakid: "1",
      kilde: "MOCK",
      vedtaksdato: "2024-01-01",
      perioder: [
        {
          fraOgMedDato: "2024-01-01",
          tilOgMedDato: "2026-05-01",
        },
      ],
      erAktivt: false,
    },
  ],
};
