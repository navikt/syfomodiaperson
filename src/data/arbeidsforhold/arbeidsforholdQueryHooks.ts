import { useQuery } from "@tanstack/react-query";
import { get } from "@/api/axios";
import { SYFOPERSON_ROOT } from "@/apiConstants";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { ArbeidsforholdPersonDTO } from "@/data/arbeidsforhold/ArbeidsforholdDTO";
import { erGyldigFodselsnummer } from "@/utils/frnValideringUtils";
import { minutesToMillis } from "@/utils/utils";

export const arbeidsforholdQueryKeys = {
  arbeidsforhold: (personident: string) => ["arbeidsforhold", personident],
};

export const useArbeidsforholdQuery = () => {
  const personident = useValgtPersonident();
  const path = `${SYFOPERSON_ROOT}/person/arbeidsforhold`;
  const fetchArbeidsforhold = () =>
    get<ArbeidsforholdPersonDTO>(path, personident);

  return useQuery({
    queryKey: arbeidsforholdQueryKeys.arbeidsforhold(personident),
    queryFn: fetchArbeidsforhold,
    enabled: !!personident && erGyldigFodselsnummer(personident),
    staleTime: minutesToMillis(60 * 12),
  });
};
