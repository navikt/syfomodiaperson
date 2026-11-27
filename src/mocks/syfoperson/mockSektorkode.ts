import { http, HttpResponse } from "msw";
import { SYFOPERSON_ROOT } from "@/apiConstants";
import { SektorkodeHierarki } from "@/data/virksomhet/Sektorkode";

const sektorkoder2012: Record<string, SektorkodeHierarki["hierarki"]> = {
  "6100": [
    { code: "6100", name: "Statsforvaltningen", parentCode: "C_OFF", level: 3 },
    {
      code: "C_OFF",
      name: "Offentlig forvaltning",
      parentCode: "INNL",
      level: 2,
    },
    { code: "INNL", name: "Innenlandske sektorer", parentCode: null, level: 1 },
  ],
  "2100": [
    {
      code: "2100",
      name: "Private aksjeselskaper mv.",
      parentCode: "A_IKKE-FIN",
      level: 3,
    },
    {
      code: "A_IKKE-FIN",
      name: "Ikke-finansielle foretak",
      parentCode: "INNL",
      level: 2,
    },
    { code: "INNL", name: "Innenlandske sektorer", parentCode: null, level: 1 },
  ],
};

/** Mocks sector hierarchies for the codes used by the Ereg fixtures (2012 standard). */
export const mockSektorkode = http.get<{ kode: string }>(
  `${SYFOPERSON_ROOT}/sektorkode/:kode`,
  ({ params, request }) => {
    const standards = new URL(request.url).searchParams.getAll("standard");
    if (standards.length !== 1 || standards[0] !== "2012") {
      return new HttpResponse(null, { status: 400 });
    }
    const codes = Object.values(sektorkoder2012).find((hierarki) =>
      hierarki.some(({ code }) => code === params.kode),
    );
    if (!codes) {
      return new HttpResponse(null, { status: 404 });
    }
    const index = codes.findIndex(({ code }) => code === params.kode);
    return HttpResponse.json<SektorkodeHierarki>({
      standard: 2012,
      hierarki: codes.slice(index),
    });
  },
);
