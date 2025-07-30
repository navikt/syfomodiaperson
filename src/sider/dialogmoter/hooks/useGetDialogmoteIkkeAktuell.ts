import { ISDIALOGMOTEKANDIDAT_ROOT } from "@/apiConstants";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { get } from "@/api/axios";
import { useQuery } from "@tanstack/react-query";
import { minutesToMillis } from "@/utils/utils";
import { IkkeAktuellArsak } from "@/data/dialogmotekandidat/types/dialogmoteikkeaktuellTypes";

export const dialogmotekandidatQueryKeys = {
  ikkeAktuellVurdering: (personident: string) => [
    "dialogmotekandidat-ikkeaktuell",
    personident,
  ],
};

export function useGetDialogmoteIkkeAktuell() {
  const personident = useValgtPersonident();
  const path = `${ISDIALOGMOTEKANDIDAT_ROOT}/ikkeaktuell/personident`;
  const fetchIkkeAktuell = () => get<IkkeAktuellVurdering[]>(path, personident);

  const query = useQuery({
    queryKey: dialogmotekandidatQueryKeys.ikkeAktuellVurdering(personident),
    queryFn: fetchIkkeAktuell,
    enabled: !!personident,
    staleTime: minutesToMillis(5),
  });

  return {
    data: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

export interface IkkeAktuellVurdering {
  createdAt: Date;
  createdBy: string;
  personIdent: string;
  arsak: IkkeAktuellArsak;
  beskrivelse?: string;
}
