import { http, HttpResponse } from "msw";
import { DraftTextDTO } from "@/hooks/useDraftQuery";

let arbeidsuforhetForhandsvarselDraft: DraftTextDTO = {
  tekst: "",
};

export const mockArbeidsuforhetForhandsvarselDraft = [
  http.get(`/api/draft/arbeidsuforhet-forhandsvarsel`, () => {
    return HttpResponse.json(arbeidsuforhetForhandsvarselDraft);
  }),
  http.put<object, DraftTextDTO>(
    `/api/draft/arbeidsuforhet-forhandsvarsel`,
    async ({ request }) => {
      const body = await request.json();
      arbeidsuforhetForhandsvarselDraft = {
        tekst: body.tekst,
      };
      return new HttpResponse(null, { status: 204 });
    }
  ),
  http.delete(`/api/draft/arbeidsuforhet-forhandsvarsel`, () => {
    arbeidsuforhetForhandsvarselDraft = {
      tekst: "",
    };
    return new HttpResponse(null, { status: 204 });
  }),
];
