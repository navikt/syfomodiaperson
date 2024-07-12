import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { VEILARBOPPFOLGING_ROOT } from "@/apiConstants";
import { post } from "@/api/axios";
import { useQuery } from "@tanstack/react-query";
import { minutesToMillis } from "@/utils/timeUtils";
import {
  UnderArbeidsrettetOppfolgingRequestDTO,
  UnderArbeidsrettetOppfolgingResponseDTO,
} from "@/data/veilarboppfolging/veilarboppfolgingTypes";

export const underArbeidsrettetOppfolgingQueryKeys = {
  underArbeidsrettetOppfolging: (fnr: string) => [
    "underArbeidsrettetOppfolging",
    fnr,
  ],
};

export const useUnderArbeidsrettetOppfolgingQuery = () => {
  const personident = useValgtPersonident();
  const path = `${VEILARBOPPFOLGING_ROOT}/hent-underOppfolging`;
  const requestDTO: UnderArbeidsrettetOppfolgingRequestDTO = {
    fnr: personident,
  };
  const postHentUnderArbeidsrettetOppfolging = () =>
    post<UnderArbeidsrettetOppfolgingResponseDTO>(path, requestDTO);

  return useQuery({
    queryKey:
      underArbeidsrettetOppfolgingQueryKeys.underArbeidsrettetOppfolging(
        personident
      ),
    queryFn: postHentUnderArbeidsrettetOppfolging,
    enabled: !!personident,
    staleTime: minutesToMillis(60 * 12),
  });
};
