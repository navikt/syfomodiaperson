import { useQuery } from "@tanstack/react-query";
import { get } from "@/api/axios";
import { SYFOPERSON_ROOT } from "@/apiConstants";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { BrukerinfoDTO } from "@/data/navbruker/types/BrukerinfoDTO";
import { erGyldigFodselsnummer } from "@/utils/frnValideringUtils";
import { minutesToMillis } from "@/utils/utils";

export const brukerinfoQueryKeys = {
  brukerinfo: (personident: string) => ["brukerinfo", personident],
};

export const useBrukerinfoQuery = () => {
  const personident = useValgtPersonident();
  const path = `${SYFOPERSON_ROOT}/person/brukerinfo`;
  const fetchBrukerInfo = () => get<BrukerinfoDTO>(path, personident);
  const query = useQuery({
    queryKey: brukerinfoQueryKeys.brukerinfo(personident),
    queryFn: fetchBrukerInfo,
    enabled: !!personident && erGyldigFodselsnummer(personident),
    staleTime: minutesToMillis(60 * 12),
  });

  const defaultData: BrukerinfoDTO = {
    navn: "",
    kontaktinfo: undefined,
    arbeidssituasjon: "ARBEIDSTAKER",
    dodsdato: null,
    tilrettelagtKommunikasjon: {
      talesprakTolk: null,
      tegnsprakTolk: null,
    },
    sikkerhetstiltak: [],
  };

  return {
    ...query,
    brukerinfo: query.data || defaultData,
    brukerKanIkkeVarslesDigitalt:
      query.data?.kontaktinfo?.skalHaVarsel === false,
    brukerKanVarslesDigitalt: query.data?.kontaktinfo?.skalHaVarsel === true,
  };
};
