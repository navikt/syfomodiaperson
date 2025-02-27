import { useMutation } from "@tanstack/react-query";
import { post } from "@/api/axios";
import { MODIACONTEXTHOLDER_ROOT } from "@/apiConstants";

export const usePostAktivBruker = () =>
  useMutation({
    mutationFn: (fnr: string) =>
      post(`${MODIACONTEXTHOLDER_ROOT}/context`, {
        verdi: fnr,
        eventType: "NY_AKTIV_BRUKER",
      }),
  });
