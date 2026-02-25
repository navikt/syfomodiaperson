import { http, HttpResponse } from "msw";
import { DraftTextDTO } from "@/hooks/useDraftQuery";

let arbeidsuforhetAvslagUtenForhandsvarselDraft: DraftTextDTO = {
  tekst: "",
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
        tekst: body.tekst,
      };
      return new HttpResponse(null, { status: 204 });
    }
  ),
  http.delete(`/api/draft/arbeidsuforhet-avslag-uten-forhandsvarsel`, () => {
    arbeidsuforhetAvslagUtenForhandsvarselDraft = {
      tekst: "",
    };
    return new HttpResponse(null, { status: 204 });
  }),
];
