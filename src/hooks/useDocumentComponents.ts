import { createParagraph } from "@/utils/documentComponentUtils";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";
import { useAktivVeilederinfoQuery } from "@/data/veilederinfo/veilederinfoQueryHooks";
import { useValgtPersonident } from "@/hooks/useValgtBruker";

export const useDocumentComponents = () => {
  const navBruker = useNavBrukerData();
  const valgtPersonident = useValgtPersonident();
  const { data: veilederinfo } = useAktivVeilederinfoQuery();

  return {
    getHilsen: () =>
      createParagraph(
        "Med vennlig hilsen",
        veilederinfo?.fulltNavn() || "",
        "Nav"
      ),
    getIntroHei: () => createParagraph(`Hei, ${navBruker.navn}`),
    getIntroGjelder: () =>
      createParagraph(`Gjelder ${navBruker.navn}, f.nr. ${valgtPersonident}`),
    getBrukerNavnFnr: () =>
      createParagraph(`${navBruker.navn}, ${valgtPersonident}`),
    getVurdertAv: () =>
      createParagraph(`Vurdert av ${veilederinfo?.fulltNavn()}`),
    getVeiledernavn: () => createParagraph(veilederinfo?.fulltNavn() || ""),
  };
};
