import { useQuery } from "@tanstack/react-query";
import { get } from "@/api/axios";
import { SYFOPERSON_ROOT } from "@/apiConstants";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import {
  BrukerinfoDTO,
  KontaktinfoDTO,
} from "@/data/navbruker/types/BrukerinfoDTO";
import { erGyldigFodselsnummer } from "@/utils/frnValideringUtils";
import { minutesToMillis } from "@/utils/utils";

export const brukerQueryKeys = {
  brukerinfo: (personident: string) => ["brukerinfo", personident],
  kontaktinfo: (personident: string) => ["kontaktinfo", personident],
};

export const useBrukerinfoQuery = () => {
  const personident = useValgtPersonident();
  const path = `${SYFOPERSON_ROOT}/person/brukerinfo`;
  const fetchBrukerInfo = () => get<BrukerinfoDTO>(path, personident);
  const query = useQuery({
    queryKey: brukerQueryKeys.brukerinfo(personident),
    queryFn: fetchBrukerInfo,
    enabled: !!personident && erGyldigFodselsnummer(personident),
    staleTime: minutesToMillis(60 * 12),
  });

  const defaultData: BrukerinfoDTO = {
    navn: "",
    aktivPersonident: "",
    arbeidssituasjon: "ARBEIDSTAKER",
    dodsdato: null,
    tilrettelagtKommunikasjon: {
      talesprakTolk: null,
      tegnsprakTolk: null,
    },
    sikkerhetstiltak: [],
  };

  return {
    data: query.data,
    brukerinfo: query.data || defaultData,
    isInaktivPersonident:
      !!personident &&
      !!query.data?.aktivPersonident &&
      personident !== query.data.aktivPersonident,
  };
};

export const useKontaktinfoQuery = () => {
  const personident = useValgtPersonident();
  const path = `${SYFOPERSON_ROOT}/person/kontaktinformasjon`;
  const fetchKontaktinfo = () => get<KontaktinfoDTO>(path, personident);
  const query = useQuery({
    queryKey: brukerQueryKeys.kontaktinfo(personident),
    queryFn: fetchKontaktinfo,
    enabled: !!personident && erGyldigFodselsnummer(personident),
    staleTime: minutesToMillis(60 * 12),
  });

  return {
    data: query.data,
    brukerKanIkkeVarslesDigitalt: query.data?.skalHaVarsel === false,
    brukerKanVarslesDigitalt: query.data?.skalHaVarsel === true,
  };
};
