import { useBehandlendeEnhet } from "@/data/behandlendeenhet/behandlendeEnhet_hooks";
import { createParagraph } from "@/utils/documentComponentUtils";
import { commonTexts } from "@/data/dialogmote/dialogmoteTexts";
import { DocumentComponentDto } from "@/data/dialogmote/types/dialogmoteTypes";
import { useVeilederinfoQuery } from "@/data/veilederinfo/veilederinfoQueryHooks";

export const useForhandsvisningHilsen = (): DocumentComponentDto[] => {
  const { data: behandlendeEnhet } = useBehandlendeEnhet();
  const { data: veilederinfo } = useVeilederinfoQuery();
  const hilsen = [createParagraph(commonTexts.hilsen, behandlendeEnhet.navn)];
  if (veilederinfo) {
    hilsen.push(createParagraph(veilederinfo.navn));
  }
  return hilsen;
};
