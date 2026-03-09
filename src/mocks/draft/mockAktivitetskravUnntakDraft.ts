import { http, HttpResponse } from "msw";
import { DraftTextDTO } from "@/hooks/useDraftQuery";

let aktivitetskravUnntakDraft: DraftTextDTO = {
  begrunnelse: "",
};

export const mockAktivitetskravUnntakDraft = [
  http.get(`/api/draft/aktivitetskrav-unntak`, () => {
    return HttpResponse.json(aktivitetskravUnntakDraft);
  }),
  http.put<object, DraftTextDTO>(
    `/api/draft/aktivitetskrav-unntak`,
    async ({ request }) => {
      const body = await request.json();
      aktivitetskravUnntakDraft = {
        begrunnelse: body.begrunnelse,
      };
      return new HttpResponse(null, { status: 204 });
    }
  ),
  http.delete(`/api/draft/aktivitetskrav-unntak`, () => {
    aktivitetskravUnntakDraft = {
      begrunnelse: "",
    };
    return new HttpResponse(null, { status: 204 });
  }),
];
