import { http, HttpResponse } from "msw";
import { PENSJON_PEN_UFOREGRAD_ROOT } from "@/apiConstants";
import { UforegradResponse } from "@/data/uforegrad/uforegradTypes";

export const mockPensjonPenUforegrad = http.get(
  `${PENSJON_PEN_UFOREGRAD_ROOT}/uforegrad`,
  () => {
    return HttpResponse.json(mockUforegrad);
  }
);

export const mockUforegrad: UforegradResponse = {
  uforegrad: 80,
};

export const mockUforegradNull: UforegradResponse = {
  uforegrad: null,
};
