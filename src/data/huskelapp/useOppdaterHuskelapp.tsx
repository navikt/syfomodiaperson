import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { ISHUSKELAPP_ROOT } from "@/apiConstants";
import { post } from "@/api/axios";
import { HuskelappDTO } from "@/data/huskelapp/huskelappTypes";
import { useMutation } from "@tanstack/react-query";

export const useOppdaterHuskelapp = () => {
  const personident = useValgtPersonident();
  const path = `${ISHUSKELAPP_ROOT}/huskelapp`;
  const postHuskelapp = (nyHuskelapp: HuskelappDTO) =>
    post<HuskelappDTO>(path, nyHuskelapp, personident);

  return useMutation({
    mutationFn: postHuskelapp,
  });
};
