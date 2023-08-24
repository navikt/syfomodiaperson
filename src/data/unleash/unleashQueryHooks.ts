import { get } from "@/api/axios";
import { defaultToggles, Toggles } from "@/data/unleash/unleash_types";
import { useQuery } from "@tanstack/react-query";
import { UNLEASH_NEXT_ROOT } from "@/apiConstants";

export const unleashQueryKeys = {
  toggles: (valgtEnhet: string, veilederIdent: string) => [
    "toggles",
    valgtEnhet,
    veilederIdent,
  ],
};

export const useFeatureToggles = () => {
  // const { data: veilederInfo } = useAktivVeilederinfoQuery();
  // const { valgtEnhet } = useValgtEnhet();
  // const veilederIdent = veilederInfo?.ident || "";
  const path = `${UNLEASH_NEXT_ROOT}/toggles`;
  //   ?valgtEnhet=${valgtEnhet}${
  //   veilederIdent ? `&userId=${veilederIdent}` : ""
  // }`;
  const fetchToggles = () => get<Toggles>(path);
  const {
    data: toggles,
    refetch: refreshToggles,
    isLoading: isLoading,
  } = useQuery({
    queryFn: fetchToggles,
    initialData: defaultToggles,
  });

  return {
    toggles,
    refreshToggles,
    isLoading,
  };
};
