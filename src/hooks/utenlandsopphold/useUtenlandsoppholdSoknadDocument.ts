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
  AvslagDocumentTextsValues,
  DelvisInnvilgetDocumentTextsValues,
  getAvslagTexts,
  getDelvisInnvilgetTexts,
  getFellesTekster,
  getInnvilgetTexts,
  InnvilgetDocumentTextsValues,
} from "@/data/utenlandsopphold/utenlandsoppholdDocumentTexts.ts";

export const useUtenlandsoppholdSoknadDocument = (): {
  getInnvilgetDocument(
    values: InnvilgetDocumentTextsValues,
  ): DocumentComponentDto[];
  getAvslagDocument(values: AvslagDocumentTextsValues): DocumentComponentDto[];
  getDelvisInnvilgetDocument(
    values: DelvisInnvilgetDocumentTextsValues,
  ): DocumentComponentDto[];
} => {
  const { getHilsen } = useDocumentComponents();

  const createFellesAvslutning = (): DocumentComponentDto[] => {
    const texts = getFellesTekster();

    return [
      createHeaderH2(texts.endringSituasjon.header),
      createParagraph(texts.endringSituasjon.body),
      createParagraph(texts.endringSituasjon.lesMer),
      createHeaderH2(texts.sporsmal.header),
      createParagraph(texts.sporsmal.body),
      createHeaderH2(texts.dineRettigheter.header),
      createHeaderH3(texts.dineRettigheter.innsyn.header),
      createParagraph(texts.dineRettigheter.innsyn.body),
      createHeaderH3(texts.dineRettigheter.klage.header),
      createParagraph(texts.dineRettigheter.klage.body),
      createParagraph(texts.dineRettigheter.klage.lesMer),
      createBulletPoints(
        texts.dineRettigheter.klage.url,
        texts.dineRettigheter.klage.urlSykepenger,
      ),
      getHilsen(),
    ];
  };

  const getInnvilgetDocument = (
    values: InnvilgetDocumentTextsValues,
  ): DocumentComponentDto[] => {
    const texts = getInnvilgetTexts(values);

    return [
      createHeaderH1(texts.tittel),
      createHeaderH2(texts.innvilget.header),
      createParagraph(texts.innvilget.intro),
      createHeaderH2(texts.begrunnelse.header),
      createParagraph(texts.begrunnelse.body),
      createParagraph(texts.begrunnelse.body2),
      createParagraph(texts.begrunnelse.paragraf),
      createHeaderH2(texts.oppmerksom.header),
      createParagraph(texts.oppmerksom.body),
      ...(texts.oppmerksom.forbehold
        ? [createParagraph(texts.oppmerksom.forbehold)]
        : []),
      ...createFellesAvslutning(),
    ];
  };

  const getAvslagDocument = (
    values: AvslagDocumentTextsValues,
  ): DocumentComponentDto[] => {
    const texts = getAvslagTexts(values);

    const documentComponents = [
      createHeaderH1(texts.tittel),
      createHeaderH2(texts.avslag.header),
      createParagraph(texts.avslag.intro),
      createHeaderH2(texts.begrunnelse.header),
      createParagraph(texts.begrunnelse.body),
      createParagraph(texts.begrunnelse.utfall),
    ];

    if (values.begrunnelse) {
      documentComponents.push(createParagraph(values.begrunnelse));
    }

    documentComponents.push(
      createParagraph(texts.begrunnelse.paragraf),
      createHeaderH2(texts.oppmerksom.header),
      createParagraph(texts.oppmerksom.body),
      ...createFellesAvslutning(),
    );

    return documentComponents;
  };

  const getDelvisInnvilgetDocument = (
    values: DelvisInnvilgetDocumentTextsValues,
  ): DocumentComponentDto[] => {
    const texts = getDelvisInnvilgetTexts(values);

    const documentComponents = [
      createHeaderH1(texts.tittel),
      createHeaderH2(texts.delvisInnvilget.header),
      createParagraph(texts.delvisInnvilget.intro),
      createHeaderH2(texts.begrunnelse.header),
      createParagraph(texts.begrunnelse.body),
      createParagraph(texts.begrunnelse.utfall),
    ];

    if (values.begrunnelse) {
      documentComponents.push(createParagraph(values.begrunnelse));
    }

    documentComponents.push(
      createParagraph(texts.begrunnelse.paragraf),
      createHeaderH2(texts.oppmerksom.header),
      createParagraph(texts.oppmerksom.body),
      ...(texts.oppmerksom.forbehold
        ? [createParagraph(texts.oppmerksom.forbehold)]
        : []),
      ...createFellesAvslutning(),
    );

    return documentComponents;
  };

  return {
    getInnvilgetDocument,
    getAvslagDocument,
    getDelvisInnvilgetDocument,
  };
};
