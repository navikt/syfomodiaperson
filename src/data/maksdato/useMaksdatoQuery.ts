import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { SYKEPENGEDAGER_INFORMASJON_ROOT } from "@/apiConstants";
import { get } from "@/api/axios";
import { useQuery } from "@tanstack/react-query";
import { minutesToMillis } from "@/utils/utils";

interface MaksdatoDTO {
  maxDate: Maksdato | null;
}

export interface Maksdato {
  id: string;
  fnr: string;
  forelopig_beregnet_slutt: Date;
  utbetalt_tom: Date;
  gjenstaende_sykedager: string;
  opprettet: Date;
}

export const maksdatoQueryKeys = {
  maksdato: (fnr: string) => ["maksdato", fnr],
};

export const useMaksdatoQuery = () => {
  const fnr = useValgtPersonident();
  const path = `${SYKEPENGEDAGER_INFORMASJON_ROOT}/sykepenger/maxdate`;
  const fetchMaksdato = () => get<MaksdatoDTO>(path, fnr);

  return useQuery({
    queryKey: maksdatoQueryKeys.maksdato(fnr),
    queryFn: fetchMaksdato,
    enabled: !!fnr,
    staleTime: minutesToMillis(60 * 12),
  });
};
