import { http, HttpResponse } from "msw";
import { DraftTextDTO } from "@/hooks/useDraftQuery";

let arbeidsuforhetAvslagUtenForhandsvarselDraft: DraftTextDTO = {
  begrunnelse: "",
};

export const mockArbeidsuforhetAvslagUtenForhandsvarselDraft = [
  http.get(`/api/draft/arbeidsuforhet-avslag-uten-forhandsvarsel`, () => {
    return HttpResponse.json(arbeidsuforhetAvslagUtenForhandsvarselDraft);
  }),
  http.put<object, DraftTextDTO>(
    `/api/draft/arbeidsuforhet-avslag-uten-forhandsvarsel`,
    async ({ request }) => {
      const body = await request.json();
      arbeidsuforhetAvslagUtenForhandsvarselDraft = {
        begrunnelse: body.begrunnelse,
      };
      return new HttpResponse(
        JSON.stringify(arbeidsuforhetAvslagUtenForhandsvarselDraft),
        { status: 200 }
      );
    }
  ),
  http.delete(`/api/draft/arbeidsuforhet-avslag-uten-forhandsvarsel`, () => {
    arbeidsuforhetAvslagUtenForhandsvarselDraft = {
      begrunnelse: "",
    };
    return new HttpResponse(null, { status: 204 });
  }),
];
