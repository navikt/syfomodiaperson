import { useQuery } from "@tanstack/react-query";
import { get } from "@/api/axios";
import { ISDIALOGMOTEKANDIDAT_ROOT } from "@/apiConstants";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import {
  DialogmotekandidatDTO,
  DialogmotekandidatHistorikkDTO,
} from "@/data/dialogmotekandidat/dialogmotekandidatTypes";
import { useLatestFerdigstiltReferat } from "@/hooks/dialogmote/useDialogmoteReferat";
import { minutesToMillis } from "@/utils/utils";

export const dialogmotekandidatQueryKeys = {
  kandidat: (personident: string) => ["dialogmotekandidat", personident],
  historikk: (personident: string) => [
    "historikk",
    "dialogmotekandidat",
    personident,
  ],
};

export const useIsDialogmoteKandidatWithoutFerdigstiltReferat = (
  kandidat?: boolean,
  kandidatAt?: string
): boolean => {
  const latestFerdigstiltReferat = useLatestFerdigstiltReferat();
  if (!kandidatAt || !kandidat) {
    return false;
  }
  if (!latestFerdigstiltReferat) {
    return true;
  }
  return (
    new Date(kandidatAt)?.getTime() >
    new Date(latestFerdigstiltReferat.createdAt).getTime()
  );
};

export const useDialogmotekandidat = () => {
  const personident = useValgtPersonident();
  const path = `${ISDIALOGMOTEKANDIDAT_ROOT}/kandidat/personident`;
  const fetchKandidat = () => get<DialogmotekandidatDTO>(path, personident);
  const query = useQuery({
    queryKey: dialogmotekandidatQueryKeys.kandidat(personident),
    queryFn: fetchKandidat,
    enabled: !!personident,
    staleTime: minutesToMillis(5),
  });

  const isNoFerdigstiltDialogmoteReferatAfterKandidatAt =
    useIsDialogmoteKandidatWithoutFerdigstiltReferat(
      query.data?.kandidat,
      query.data?.kandidatAt
    );
  const isKandidat: boolean =
    isNoFerdigstiltDialogmoteReferatAfterKandidatAt || false;

  return {
    data: query.data || {},
    isKandidat,
  };
};

export const useDialogmotekandidatHistorikkQuery = () => {
  const personident = useValgtPersonident();
  const path = `${ISDIALOGMOTEKANDIDAT_ROOT}/kandidat/historikk`;
  const fetchHistorikk = () =>
    get<DialogmotekandidatHistorikkDTO[]>(path, personident);
  return useQuery({
    queryKey: dialogmotekandidatQueryKeys.historikk(personident),
    queryFn: fetchHistorikk,
    enabled: !!personident,
  });
};
