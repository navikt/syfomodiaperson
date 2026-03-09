import { http, HttpResponse } from "msw";
import { DraftTextDTO } from "@/hooks/useDraftQuery";

let aktivitetskravInnstillingOmStansDraft: DraftTextDTO = {
  begrunnelse: "",
};

export const mockAktivitetskravInnstillingOmStansDraft = [
  http.get(`/api/draft/aktivitetskrav-innstilling-om-stans`, () => {
    return HttpResponse.json(aktivitetskravInnstillingOmStansDraft);
  }),
  http.put<object, DraftTextDTO>(
    `/api/draft/aktivitetskrav-innstilling-om-stans`,
    async ({ request }) => {
      const body = await request.json();
      aktivitetskravInnstillingOmStansDraft = {
        begrunnelse: body.begrunnelse,
      };
      return new HttpResponse(null, { status: 204 });
    }
  ),
  http.delete(`/api/draft/aktivitetskrav-innstilling-om-stans`, () => {
    aktivitetskravInnstillingOmStansDraft = {
      begrunnelse: "",
    };
    return new HttpResponse(null, { status: 204 });
  }),
];
