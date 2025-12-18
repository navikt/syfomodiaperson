import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, post } from "@/api/axios";
import { ISDIALOGMOTEKANDIDAT_ROOT } from "@/apiConstants";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import {
  DialogmotekandidatDTO,
  DialogmotekandidatHistorikkDTO,
  AvventDTO,
  CreateAvventDTO,
} from "@/data/dialogmotekandidat/dialogmotekandidatTypes";
import { minutesToMillis } from "@/utils/utils";
import { ReferatDTO } from "@/sider/dialogmoter/types/dialogmoteReferatTypes";
import { useDialogmoterQuery } from "@/sider/dialogmoter/hooks/dialogmoteQueryHooks";
import { DialogmoteDTO } from "@/sider/dialogmoter/types/dialogmoteTypes";

export const dialogmotekandidatQueryKeys = {
  kandidat: (personident: string) => ["dialogmotekandidat", personident],
  historikk: (personident: string) => [
    "historikk",
    "dialogmotekandidat",
    personident,
  ],
  avvent: (personident: string) => [
    "avvent",
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

const useLatestFerdigstiltReferat = (): ReferatDTO | undefined => {
  const { ferdigstilteDialogmoter } = useDialogmoterQuery();
  const latestFerdigstiltDialogmote: DialogmoteDTO | undefined =
    ferdigstilteDialogmoter.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })[0];
  return latestFerdigstiltDialogmote?.referatList.filter(
    (referat) => referat.ferdigstilt
  )[0];
};

function useAvventQuery() {
  const personident = useValgtPersonident();
  const path = `${ISDIALOGMOTEKANDIDAT_ROOT}/avvent/personident`;
  const fetchAvvent = () => get<AvventDTO[]>(path, personident);

  const query = useQuery({
    queryKey: dialogmotekandidatQueryKeys.avvent(personident),
    queryFn: fetchAvvent,
    enabled: !!personident,
    staleTime: minutesToMillis(5),
  });

  const avventListe = query.data || [];
  const sisteAvventDto: AvventDTO | undefined = avventListe[0];

  return {
    data: sisteAvventDto,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

export const useDialogmotekandidat = () => {
  const personident = useValgtPersonident();
  const path = `${ISDIALOGMOTEKANDIDAT_ROOT}/kandidat/personident`;
  const fetchKandidat = () => get<DialogmotekandidatDTO>(path, personident);
  const kandidatQuery = useQuery({
    queryKey: dialogmotekandidatQueryKeys.kandidat(personident),
    queryFn: fetchKandidat,
    enabled: !!personident,
    staleTime: minutesToMillis(5),
  });

  const { data: avvent } = useAvventQuery();

  const isNoFerdigstiltDialogmoteReferatAfterKandidatAt =
    useIsDialogmoteKandidatWithoutFerdigstiltReferat(
      kandidatQuery.data?.kandidat,
      kandidatQuery.data?.kandidatAt
    );
  const isKandidat: boolean =
    isNoFerdigstiltDialogmoteReferatAfterKandidatAt || false;

  return {
    data: kandidatQuery.data || {},
    isKandidat,
    avvent,
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

export const useAvventDialogmoteMutation = () => {
  const queryClient = useQueryClient();
  const personIdent = useValgtPersonident();

  return useMutation({
    mutationFn: (payload: Omit<CreateAvventDTO, "personIdent">) => {
      const path = `${ISDIALOGMOTEKANDIDAT_ROOT}/avvent/personident`;
      const body: CreateAvventDTO = {
        personIdent: personIdent,
        frist: payload.frist,
        beskrivelse: payload.beskrivelse,
      };
      return post<AvventDTO>(path, body, personIdent);
    },
    onSuccess: async () => {
      if (personIdent) {
        await queryClient.invalidateQueries({
          queryKey: dialogmotekandidatQueryKeys.avvent(personIdent),
        });
      }
    },
  });
};
