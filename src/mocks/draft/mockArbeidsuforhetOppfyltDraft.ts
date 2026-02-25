import { http, HttpResponse } from "msw";
import { DraftTextDTO } from "@/hooks/useDraftQuery";

let arbeidsuforhetOppfyltDraft: DraftTextDTO = {
  tekst: "",
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
        tekst: body.tekst,
      };
      return new HttpResponse(null, { status: 204 });
    }
  ),
  http.delete(`/api/draft/arbeidsuforhet-oppfylt`, () => {
    arbeidsuforhetOppfyltDraft = {
      tekst: "",
    };
    return new HttpResponse(null, { status: 204 });
  }),
];
