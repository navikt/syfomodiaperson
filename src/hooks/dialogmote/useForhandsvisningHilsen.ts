import { createParagraph } from "@/utils/documentComponentUtils";
import { commonTexts } from "@/data/dialogmote/dialogmoteTexts";
import { DocumentComponentDto } from "@/data/dialogmote/types/dialogmoteTypes";
import { useVeilederinfoQuery } from "@/data/veilederinfo/veilederinfoQueryHooks";
import { useBehandlendeEnhetQuery } from "@/data/behandlendeenhet/behandlendeEnhetQueryHooks";
import { useValgtPersonident } from "@/hooks/useValgtBruker";

export const useForhandsvisningHilsen = (): DocumentComponentDto[] => {
  const fnr = useValgtPersonident();
  const { data: behandlendeEnhet } = useBehandlendeEnhetQuery(fnr);
  const { data: veilederinfo } = useVeilederinfoQuery();
  const hilsen = [
    createParagraph(commonTexts.hilsen, behandlendeEnhet?.navn || ""),
  ];
  if (veilederinfo) {
    hilsen.push(createParagraph(veilederinfo.navn));
  }
  return hilsen;
};
