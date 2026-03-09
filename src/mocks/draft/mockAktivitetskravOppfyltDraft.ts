import { http, HttpResponse } from "msw";
import { DraftTextDTO } from "@/hooks/useDraftQuery";

let aktivitetskravOppfyltDraft: DraftTextDTO = {
  begrunnelse: "",
};

export const mockAktivitetskravOppfyltDraft = [
  http.get(`/api/draft/aktivitetskrav-oppfylt`, () => {
    return HttpResponse.json(aktivitetskravOppfyltDraft);
  }),
  http.put<object, DraftTextDTO>(
    `/api/draft/aktivitetskrav-oppfylt`,
    async ({ request }) => {
      const body = await request.json();
      aktivitetskravOppfyltDraft = {
        begrunnelse: body.begrunnelse,
      };
      return new HttpResponse(null, { status: 204 });
    }
  ),
  http.delete(`/api/draft/aktivitetskrav-oppfylt`, () => {
    aktivitetskravOppfyltDraft = {
      begrunnelse: "",
    };
    return new HttpResponse(null, { status: 204 });
  }),
];
