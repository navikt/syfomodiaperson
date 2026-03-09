import { http, HttpResponse } from "msw";
import { DraftTextDTO } from "@/hooks/useDraftQuery";

let aktivitetskravForhandsvarselDraft: DraftTextDTO = {
  begrunnelse: "",
};

export const mockAktivitetskravForhandsvarselDraft = [
  http.get(`/api/draft/aktivitetskrav-forhandsvarsel`, () => {
    return HttpResponse.json(aktivitetskravForhandsvarselDraft);
  }),
  http.put<object, DraftTextDTO>(
    `/api/draft/aktivitetskrav-forhandsvarsel`,
    async ({ request }) => {
      const body = await request.json();
      aktivitetskravForhandsvarselDraft = {
        begrunnelse: body.begrunnelse,
      };
      return new HttpResponse(null, { status: 204 });
    }
  ),
  http.delete(`/api/draft/aktivitetskrav-forhandsvarsel`, () => {
    aktivitetskravForhandsvarselDraft = {
      begrunnelse: "",
    };
    return new HttpResponse(null, { status: 204 });
  }),
];
