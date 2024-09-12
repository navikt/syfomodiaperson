import { DocumentComponentDto } from "@/data/documentcomponent/documentComponentTypes";
import {
  createHeaderH1,
  createParagraph,
  createParagraphWithTitle,
} from "@/utils/documentComponentUtils";
import { useDocumentComponents } from "@/hooks/useDocumentComponents";
import {
  getForhandsvarselManglendeMedvirkningTexts,
  getOppfyltManglendeMedvirkningTexts,
} from "@/data/manglendemedvirkning/manglendeMedvirkningDocumentTexts";

type ForhandsvarselDocumentValues = {
  begrunnelse: string;
  frist: Date;
};

type OppfyltDocumentValues = {
  begrunnelse: string;
  forhandsvarselSendtDato: Date;
};

interface Documents {
  getForhandsvarselDocument(
    values: ForhandsvarselDocumentValues
  ): DocumentComponentDto[];
  getOppfyltDocument(values: OppfyltDocumentValues): DocumentComponentDto[];
}

export function useManglendeMedvirkningVurderingDocument(): Documents {
  const { getHilsen, getVurdertAv, getIntroGjelder } = useDocumentComponents();

  function getForhandsvarselDocument(
    values: ForhandsvarselDocumentValues
  ): DocumentComponentDto[] {
    const forhandsvarselTexts = getForhandsvarselManglendeMedvirkningTexts(
      values.frist
    );
    const documentComponents = [
      createHeaderH1(forhandsvarselTexts.title),
      createParagraph(forhandsvarselTexts.intro.p1),
      createParagraph(forhandsvarselTexts.intro.p2),
      createParagraph(forhandsvarselTexts.intro.p3),
    ];

    if (values.begrunnelse) {
      documentComponents.push(createParagraph(values.begrunnelse));
    }
    documentComponents.push(
      createParagraphWithTitle(
        forhandsvarselTexts.tilbakemelding.header,
        forhandsvarselTexts.tilbakemelding.info
      ),
      createParagraphWithTitle(
        forhandsvarselTexts.kontaktinfo.header,
        forhandsvarselTexts.kontaktinfo.info
      ),
      createParagraphWithTitle(
        forhandsvarselTexts.lovhjemmel.header,
        forhandsvarselTexts.lovhjemmel.intro
      ),
      createParagraph(forhandsvarselTexts.lovhjemmel.pliktInfo1),
      createParagraph(forhandsvarselTexts.lovhjemmel.pliktInfo2),
      getHilsen()
    );

    return documentComponents;
  }

  function getOppfyltDocument({
    begrunnelse,
    forhandsvarselSendtDato,
  }: OppfyltDocumentValues): DocumentComponentDto[] {
    const oppfyltTexts = getOppfyltManglendeMedvirkningTexts(
      forhandsvarselSendtDato
    );
    return [
      createHeaderH1(oppfyltTexts.title),
      getIntroGjelder(),
      createParagraph(oppfyltTexts.previousForhandsvarsel),
      createParagraph(oppfyltTexts.forAFaSykepenger),
      createParagraph(begrunnelse),
      createParagraph(oppfyltTexts.viHarBruktLoven),
      getVurdertAv(),
    ];
  }

  return {
    getForhandsvarselDocument,
    getOppfyltDocument,
  };
}
