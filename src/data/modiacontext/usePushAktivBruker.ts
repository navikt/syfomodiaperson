import { MODIACONTEXTHOLDER_ROOT } from "@/apiConstants";
import { post } from "@/api/axios";
import { EventType } from "@/data/modiacontext/modiacontextTypes";
import { useMutation } from "react-query";

const redirectWithoutFnrInUrl = (fnr: string) => {
  window.location.href = window.location.pathname.replace(`/${fnr}`, "");
};

export const usePushAktivBruker = (fnr: string) => {
  const path = `${MODIACONTEXTHOLDER_ROOT}/context`;
  const postNyAktivBruker = () =>
    post(path, { verdi: fnr, eventType: EventType.NY_AKTIV_BRUKER });

  return useMutation(postNyAktivBruker, {
    onSuccess: () => redirectWithoutFnrInUrl(fnr),
  });
};
