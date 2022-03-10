import { createParagraph } from "@/utils/documentComponentUtils";
import { commonTexts } from "@/data/dialogmote/dialogmoteTexts";
import { DocumentComponentDto } from "@/data/dialogmote/types/dialogmoteTypes";
import { useVeilederinfoQuery } from "@/data/veilederinfo/veilederinfoQueryHooks";

export const useForhandsvisningHilsen = (): DocumentComponentDto[] => {
  const { data: veilederinfo } = useVeilederinfoQuery();
  return [createParagraph(commonTexts.hilsen, veilederinfo?.navn || "", "NAV")];
};
