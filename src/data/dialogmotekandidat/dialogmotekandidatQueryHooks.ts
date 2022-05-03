import { useQuery } from "react-query";
import { get } from "@/api/axios";
import { ISDIALOGMOTEKANDIDAT_ROOT } from "@/apiConstants";
import { useFeatureToggles } from "@/data/unleash/unleashQueryHooks";
import { ToggleNames } from "@/data/unleash/unleash_types";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { DialogmotekandidatDTO } from "@/data/dialogmotekandidat/dialogmotekandidatTypes";

export const dialogmotekandidatQueryKeys = {
  kandidat: (fnr: string) => ["dialogmotekandidat", fnr],
};

export const useDialogmotekandidat = () => {
  const { isFeatureEnabled } = useFeatureToggles();
  const visDialogmotekandidat = isFeatureEnabled(
    ToggleNames.dialogmotekandidat
  );

  const fnr = useValgtPersonident();
  const path = `${ISDIALOGMOTEKANDIDAT_ROOT}/kandidat/personident`;
  const fetchKandidat = () => get<DialogmotekandidatDTO>(path, fnr);
  const query = useQuery(
    dialogmotekandidatQueryKeys.kandidat(fnr),
    fetchKandidat,
    {
      enabled: !!fnr && visDialogmotekandidat,
    }
  );

  const isKandidat = (visDialogmotekandidat && query.data?.kandidat) || false;

  return {
    ...query,
    isKandidat,
  };
};
