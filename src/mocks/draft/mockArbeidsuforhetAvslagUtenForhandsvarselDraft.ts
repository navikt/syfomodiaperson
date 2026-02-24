import { http, HttpResponse } from "msw";
import { TextBoxDraftDTO } from "@/hooks/draftTypes";

let arbeidsuforhetAvslagUtenForhandsvarselDraft: TextBoxDraftDTO = {
  begrunnelse: "",
};

export const mockArbeidsuforhetAvslagUtenForhandsvarselDraft = [
  http.get(`/api/draft/arbeidsuforhet-avslag-uten-forhandsvarsel`, () => {
    return HttpResponse.json(arbeidsuforhetAvslagUtenForhandsvarselDraft);
  }),
  http.put<object, TextBoxDraftDTO>(
    `/api/draft/arbeidsuforhet-avslag-uten-forhandsvarsel`,
    async ({ request }) => {
      const body = await request.json();
      arbeidsuforhetAvslagUtenForhandsvarselDraft = {
        begrunnelse: body.begrunnelse,
      };
      return new HttpResponse(null, { status: 204 });
    }
  ),
  http.delete(`/api/draft/arbeidsuforhet-avslag-uten-forhandsvarsel`, () => {
    arbeidsuforhetAvslagUtenForhandsvarselDraft = {
      begrunnelse: "",
    };
    return new HttpResponse(null, { status: 204 });
  }),
];
