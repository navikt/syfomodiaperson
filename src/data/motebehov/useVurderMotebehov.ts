import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { ISDIALOGMOTE_ROOT } from "@/apiConstants";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { post } from "@/api/axios";
import { motebehovQueryKeys } from "@/data/motebehov/motebehovQueryHooks";
import { useAktivVeilederinfoQuery } from "@/data/veilederinfo/veilederinfoQueryHooks";
import { MotebehovVeilederDTO } from "@/data/motebehov/types/motebehovTypes";

export interface MotebehovTilbakemeldingDTO {
  varseltekst: string;
  motebehovId: string;
}

export interface MotebehovVurderingDTO {
  personident: string;
  harBehovForMote: boolean;
  tilbakemeldinger: MotebehovTilbakemeldingDTO[];
}

export function useVurderMotebehov() {
  const fnr = useValgtPersonident();
  const { data: veilederinfo } = useAktivVeilederinfoQuery();
  const veilederIdent = veilederinfo?.ident;
  const queryClient = useQueryClient();
  const path = `${ISDIALOGMOTE_ROOT}/motebehov/vurderinger`;
  const motebehovQueryKey = motebehovQueryKeys.motebehov(fnr);

  return useMutation({
    mutationFn: (vurdering: Omit<MotebehovVurderingDTO, "personident">) =>
      post(path, { ...vurdering, personident: fnr }, fnr),
    onSuccess: () => {
      const previousMotebehov =
        queryClient.getQueryData<MotebehovVeilederDTO[]>(motebehovQueryKey);
      if (previousMotebehov && veilederIdent) {
        queryClient.setQueryData(
          motebehovQueryKey,
          previousMotebehov.map((motebehov) => ({
            ...motebehov,
            behandletTidspunkt: new Date(),
            behandletVeilederIdent: veilederIdent,
          }))
        );
      }
    },
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: motebehovQueryKey,
      }),
  });
}
