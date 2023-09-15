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
      createParagraph("Vennlig hilsen", veilederinfo?.navn || "", "NAV"),
    getIntroHei: (personident?: string) =>
      createParagraph(
        `Hei, ${navBruker.navn}${personident ? `, ${personident}` : ""}`
      ),
    getIntroGjelder: () =>
      createParagraph(`Gjelder ${navBruker.navn}, f.nr. ${valgtPersonident}`),
  };
};
