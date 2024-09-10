import { DocumentComponentDto } from "@/data/documentcomponent/documentComponentTypes";
import {
  createHeaderH1,
  createParagraph,
  createParagraphWithTitle,
} from "@/utils/documentComponentUtils";
import { useDocumentComponents } from "@/hooks/useDocumentComponents";
import { getForhandsvarselManglendeMedvirkningTexts } from "@/data/manglendemedvirkning/manglendeMedvirkningDocumentTexts";

type ForhandsvarselDocumentValues = {
  begrunnelse: string;
  frist: Date;
};

interface Documents {
  getForhandsvarselDocument(
    values: ForhandsvarselDocumentValues
  ): DocumentComponentDto[];
}

export function useManglendeMedvirkningVurderingDocument(): Documents {
  const { getHilsen } = useDocumentComponents();

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

  return {
    getForhandsvarselDocument,
  };
}
