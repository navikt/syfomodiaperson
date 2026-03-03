import { http, HttpResponse } from "msw";
import { DraftTextDTO } from "@/hooks/useDraftQuery";

let arbeidsuforhetOppfyltDraft: DraftTextDTO = {
  begrunnelse: "",
};

export const mockArbeidsuforhetOppfyltDraft = [
  http.get(`/api/draft/arbeidsuforhet-oppfylt`, () => {
    return HttpResponse.json(arbeidsuforhetOppfyltDraft);
  }),
  http.put<object, DraftTextDTO>(
    `/api/draft/arbeidsuforhet-oppfylt`,
    async ({ request }) => {
      const body = await request.json();
      arbeidsuforhetOppfyltDraft = {
        begrunnelse: body.begrunnelse,
      };
      return new HttpResponse(JSON.stringify(arbeidsuforhetOppfyltDraft), {
        status: 200,
      });
    }
  ),
  http.delete(`/api/draft/arbeidsuforhet-oppfylt`, () => {
    arbeidsuforhetOppfyltDraft = {
      begrunnelse: "",
    };
    return new HttpResponse(null, { status: 204 });
  }),
];
