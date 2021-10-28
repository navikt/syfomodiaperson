import { get } from "@/api/axios";
import { VEDTAK_ROOT } from "@/apiConstants";
import { useQuery } from "react-query";
import { VedtakDTO } from "./vedtakTypes";
import { useValgtPersonident } from "@/hooks/useValgtBruker";

const vedtakQueryKeys = {
  vedtak: (fnr: string) => ["vedtak", fnr],
};

export const useVedtakQuery = () => {
  const fnr = useValgtPersonident();
  const path = `${VEDTAK_ROOT}?fnr=${fnr}`;
  const fetchVedtak = () => get<VedtakDTO[]>(path);
  return useQuery(vedtakQueryKeys.vedtak(fnr), fetchVedtak, {
    enabled: !!fnr,
  });
};
