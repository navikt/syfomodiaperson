import { DocumentComponentDto } from "@/data/documentcomponent/documentComponentTypes";
import { useDocumentComponents } from "@/hooks/useDocumentComponents";
import {
  createHeaderH1,
  createHeaderH2,
  createHeaderH3,
  createBulletPoints,
  createParagraph,
} from "@/utils/documentComponentUtils";
import {
  getUtenlandsoppholdDocumentTexts,
  UtenlandsoppholdDocumentTextsValues,
} from "@/data/utenlandsopphold/utenlandsoppholdDocumentTexts.ts";

export const useUtenlandsoppholdSoknadDocument = (): {
  getVedtakDocument(
    values: UtenlandsoppholdDocumentTextsValues,
  ): DocumentComponentDto[];
} => {
  const { getHilsen } = useDocumentComponents();

  const getVedtakDocument = (
    values: UtenlandsoppholdDocumentTextsValues,
  ): DocumentComponentDto[] => {
    const soknadTexts = getUtenlandsoppholdDocumentTexts(values);

    return [
      createHeaderH1(soknadTexts.header),
      createHeaderH2(soknadTexts.innvilget.header),
      createParagraph(soknadTexts.innvilget.intro),
      createHeaderH2(soknadTexts.begrunnelse.header),
      createParagraph(soknadTexts.begrunnelse.body),
      createParagraph(soknadTexts.begrunnelse.body2),
      createParagraph(soknadTexts.begrunnelse.paragraf),
      createHeaderH2(soknadTexts.oppmerksom.header),
      createParagraph(soknadTexts.oppmerksom.body),
      createHeaderH2(soknadTexts.endringSituasjon.header),
      createParagraph(soknadTexts.endringSituasjon.body),
      createParagraph(soknadTexts.endringSituasjon.lesMer),
      createHeaderH2(soknadTexts.sporsmal.header),
      createParagraph(soknadTexts.sporsmal.body),
      createHeaderH2(soknadTexts.dineRettigheter.header),
      createHeaderH3(soknadTexts.dineRettigheter.innsyn.header),
      createParagraph(soknadTexts.dineRettigheter.innsyn.body),
      createHeaderH3(soknadTexts.dineRettigheter.klage.header),
      createParagraph(soknadTexts.dineRettigheter.klage.body),
      createParagraph(soknadTexts.dineRettigheter.klage.lesMer),
      createBulletPoints(
        soknadTexts.dineRettigheter.klage.url,
        soknadTexts.dineRettigheter.klage.urlSykepenger,
      ),
      getHilsen(),
    ];
  };

  return {
    getVedtakDocument,
  };
};
