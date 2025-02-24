import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { PENSJON_PEN_UFOREGRAD_ROOT } from "@/apiConstants";
import { get } from "@/api/axios";
import { useQuery } from "@tanstack/react-query";
import { UforegradResponse } from "@/data/uforegrad/uforegradTypes";

export const uforegradQueryKeys = {
  uforegrad: (personident: string) => ["uforegrad", personident],
};

export const useUforegradQuery = () => {
  const personident = useValgtPersonident();
  const dateQueryParam = new Date().toISOString().split("T")[0]; // Vi ønsker alltid å sjekke uføregrad for dagens dato
  const path = `${PENSJON_PEN_UFOREGRAD_ROOT}/uforegrad?dato=${dateQueryParam}`;
  const additionalHeader = {
    ["fnr"]: personident,
  };
  const fetchUforegrad = () =>
    get<UforegradResponse>(path, personident, additionalHeader);

  return useQuery({
    queryKey: uforegradQueryKeys.uforegrad(personident),
    queryFn: fetchUforegrad,
    enabled: !!personident,
  });
};
