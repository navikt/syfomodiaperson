import { useQuery } from "react-query";
import { get } from "@/api/axios";
import { ISDIALOGMOTEKANDIDAT_ROOT } from "@/apiConstants";
import { useFeatureToggles } from "@/data/unleash/unleashQueryHooks";
import { ToggleNames } from "@/data/unleash/unleash_types";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { DialogmotekandidatDTO } from "@/data/dialogmotekandidat/dialogmotekandidatTypes";

export const dialogmotekandidatQueryKeys = {
  kandidat: (personident: string) => ["dialogmotekandidat", personident],
};

export const useDialogmotekandidat = () => {
  const { isFeatureEnabled } = useFeatureToggles();
  const visDialogmotekandidat = isFeatureEnabled(
    ToggleNames.dialogmotekandidat
  );

  const personident = useValgtPersonident();
  const path = `${ISDIALOGMOTEKANDIDAT_ROOT}/kandidat/personident`;
  const fetchKandidat = () => get<DialogmotekandidatDTO>(path, personident);
  const query = useQuery(
    dialogmotekandidatQueryKeys.kandidat(personident),
    fetchKandidat,
    {
      enabled: !!personident && visDialogmotekandidat,
    }
  );

  const isKandidat = (visDialogmotekandidat && query.data?.kandidat) || false;

  return {
    ...query,
    isKandidat,
  };
};
