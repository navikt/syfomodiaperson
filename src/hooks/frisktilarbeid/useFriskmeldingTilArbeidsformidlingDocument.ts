import { DocumentComponentDto } from "@/data/documentcomponent/documentComponentTypes";
import { useDocumentComponents } from "@/hooks/useDocumentComponents";
import {
  createBulletPoints,
  createHeaderH1,
  createHeaderH2,
  createHeaderH3,
  createParagraph,
} from "@/utils/documentComponentUtils";
import {
  getVedtakTexts,
  VedtakTextsValues,
} from "@/data/frisktilarbeid/frisktilarbeidDocumentTexts";

type VedtakDocumentValues = VedtakTextsValues & {
  begrunnelse: string | undefined;
  tilDatoIsMaxDato: boolean;
};

export const useFriskmeldingTilArbeidsformidlingDocument = (): {
  getVedtakDocument(values: VedtakDocumentValues): DocumentComponentDto[];
} => {
  const { getHilsen } = useDocumentComponents();

  const getVedtakDocument = (
    values: VedtakDocumentValues
  ): DocumentComponentDto[] => {
    const vedtakTexts = getVedtakTexts(values);
    const documentComponentDtos = [
      createHeaderH1(vedtakTexts.header),
      createHeaderH2(vedtakTexts.innvilget.header),
      createParagraph(vedtakTexts.innvilget.intro),
      createParagraph(vedtakTexts.innvilget.periode),
    ];

    if (values.tilDatoIsMaxDato) {
      documentComponentDtos.push(createParagraph(vedtakTexts.maksdato));
    }

    documentComponentDtos.push(createHeaderH2(vedtakTexts.begrunnelse.header));
    if (values.begrunnelse) {
      documentComponentDtos.push(createParagraph(values.begrunnelse));
    }
    documentComponentDtos.push(createParagraph(vedtakTexts.begrunnelse.body));

    documentComponentDtos.push(
      createHeaderH2(vedtakTexts.sykmelding.header),
      createParagraph(vedtakTexts.sykmelding.body),
      createHeaderH2(vedtakTexts.forAFaSykepenger.header),
      createParagraph(vedtakTexts.forAFaSykepenger.body),
      createHeaderH2(vedtakTexts.farNyJobb.header),
      createParagraph(vedtakTexts.farNyJobb.body),
      createHeaderH2(vedtakTexts.ikkeFarNyJobb.header),
      createParagraph(
        vedtakTexts.ikkeFarNyJobb.body,
        vedtakTexts.ikkeFarNyJobb.lesMer
      ),
      createHeaderH2(vedtakTexts.endringSituasjon.header),
      createParagraph(vedtakTexts.endringSituasjon.body),
      createParagraph(vedtakTexts.endringSituasjon.lesMer),
      createHeaderH2(vedtakTexts.sporsmal.header),
      createParagraph(vedtakTexts.sporsmal.body),
      createHeaderH2(vedtakTexts.dineRettigheter.header),
      createHeaderH3(vedtakTexts.dineRettigheter.innsyn.header),
      createParagraph(vedtakTexts.dineRettigheter.innsyn.body),
      createHeaderH3(vedtakTexts.dineRettigheter.klage.header),
      createParagraph(vedtakTexts.dineRettigheter.klage.body),
      createParagraph(vedtakTexts.dineRettigheter.klage.lesMer),
      createBulletPoints(
        vedtakTexts.dineRettigheter.klage.url,
        vedtakTexts.dineRettigheter.klage.urlSykepenger
      ),
      getHilsen()
    );

    return documentComponentDtos;
  };

  return {
    getVedtakDocument,
  };
};
