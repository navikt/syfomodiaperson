import { useQuery } from "react-query";
import { get } from "@/api/axios";
import { ISDIALOGMOTEKANDIDAT_ROOT } from "@/apiConstants";
import { useFeatureToggles } from "@/data/unleash/unleashQueryHooks";
import { ToggleNames } from "@/data/unleash/unleash_types";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { UnntakDTO } from "@/data/dialogmotekandidat/types/dialogmoteunntakTypes";

export const dialogmoteunntakQueryKeys = {
  unntak: (personident: string) => ["dialogmoteunntak", personident],
};

export const useDialogmoteunntakQuery = () => {
  const { isFeatureEnabled } = useFeatureToggles();
  const visDialogmotekandidat: boolean = isFeatureEnabled(
    ToggleNames.dialogmotekandidat
  );

  const personident = useValgtPersonident();
  const path = `${ISDIALOGMOTEKANDIDAT_ROOT}/unntak/personident`;
  const fetchUnntak = () => get<UnntakDTO[]>(path, personident);
  const query = useQuery(
    dialogmoteunntakQueryKeys.unntak(personident),
    fetchUnntak,
    {
      enabled: !!personident && visDialogmotekandidat,
    }
  );

  return {
    ...query,
    data: query.data || [],
  };
};
