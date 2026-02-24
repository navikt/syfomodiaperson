import { http, HttpResponse } from "msw";
import { TextBoxDraftDTO } from "@/hooks/draftTypes";

let arbeidsuforhetOppfyltDraft: TextBoxDraftDTO = {
  begrunnelse: "",
};

export const mockArbeidsuforhetOppfyltDraft = [
  http.get(`/api/draft/arbeidsuforhet-oppfylt`, () => {
    return HttpResponse.json(arbeidsuforhetOppfyltDraft);
  }),
  http.put<object, TextBoxDraftDTO>(
    `/api/draft/arbeidsuforhet-oppfylt`,
    async ({ request }) => {
      const body = await request.json();
      arbeidsuforhetOppfyltDraft = {
        begrunnelse: body.begrunnelse,
      };
      return new HttpResponse(null, { status: 204 });
    }
  ),
  http.delete(`/api/draft/arbeidsuforhet-oppfylt`, () => {
    arbeidsuforhetOppfyltDraft = {
      begrunnelse: "",
    };
    return new HttpResponse(null, { status: 204 });
  }),
];
