import { DocumentComponentDto } from "@/data/documentcomponent/documentComponentTypes";
import { useDocumentComponents } from "@/hooks/useDocumentComponents";
import {
  createBulletPoints,
  createHeaderH1,
  createParagraph,
  createParagraphWithTitle,
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
  const { getHilsen, getBrukerNavnFnr } = useDocumentComponents();

  const getVedtakDocument = (
    values: VedtakDocumentValues
  ): DocumentComponentDto[] => {
    const vedtakTexts = getVedtakTexts(values);
    const documentComponentDtos = [
      createHeaderH1(vedtakTexts.header),
      getBrukerNavnFnr(),
      createParagraph(vedtakTexts.intro),
      createParagraph(vedtakTexts.periode),
    ];

    if (values.tilDatoIsMaxDato) {
      documentComponentDtos.push(createParagraph(vedtakTexts.maksdato));
    }

    documentComponentDtos.push(
      createParagraph(
        vedtakTexts.arbeidssoker.part1,
        vedtakTexts.arbeidssoker.part2
      ),
      createParagraph(vedtakTexts.hjemmel),
      createParagraphWithTitle(
        vedtakTexts.begrunnelse.header,
        values.begrunnelse ? values.begrunnelse : ""
      )
    );

    documentComponentDtos.push(
      createParagraph(vedtakTexts.begrunnelse.part1),
      createParagraphWithTitle(
        vedtakTexts.nyttigInfo.header,
        vedtakTexts.nyttigInfo.part1
      ),
      createParagraph(vedtakTexts.nyttigInfo.meldekortInfo.header),
      createBulletPoints(
        vedtakTexts.nyttigInfo.meldekortInfo.bulletPoint1,
        vedtakTexts.nyttigInfo.meldekortInfo.bulletPoint2,
        vedtakTexts.nyttigInfo.meldekortInfo.bulletPoint3
      ),
      createParagraph(vedtakTexts.nyttigInfo.part2),
      createParagraph(vedtakTexts.nyttigInfo.part3),
      createParagraph(vedtakTexts.nyttigInfo.part4),
      createParagraph(vedtakTexts.behandler),
      createParagraphWithTitle(
        vedtakTexts.sporsmal.header,
        vedtakTexts.sporsmal.body
      ),
      createParagraph(vedtakTexts.kontakt),
      createParagraphWithTitle(
        vedtakTexts.innsyn.header,
        vedtakTexts.innsyn.body
      ),
      createParagraphWithTitle(
        vedtakTexts.klage.header,
        vedtakTexts.klage.body
      ),
      getHilsen()
    );

    return documentComponentDtos;
  };

  return {
    getVedtakDocument,
  };
};
