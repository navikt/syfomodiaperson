import {
  DocumentComponentDto,
  DocumentComponentType,
} from "@/data/documentcomponent/documentComponentTypes";
import { VEILEDER_DEFAULT } from "../../mock/common/mockConstants";
import { getForhandsvarselManglendeMedvirkningTexts } from "@/data/manglendemedvirkning/manglendeMedvirkningDocumentTexts";

export const getSendForhandsvarselDocument = (
  begrunnelse: string,
  frist: Date
): DocumentComponentDto[] => {
  const forhandsvarselTexts = getForhandsvarselManglendeMedvirkningTexts(frist);
  return [
    {
      texts: [forhandsvarselTexts.title],
      type: DocumentComponentType.HEADER_H1,
    },
    {
      texts: [forhandsvarselTexts.intro.p1],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: [forhandsvarselTexts.intro.p2],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: [forhandsvarselTexts.intro.p3],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: [begrunnelse],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      title: forhandsvarselTexts.tilbakemelding.header,
      texts: [forhandsvarselTexts.tilbakemelding.info],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      title: forhandsvarselTexts.kontaktinfo.header,
      texts: [forhandsvarselTexts.kontaktinfo.info],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      title: forhandsvarselTexts.lovhjemmel.header,
      texts: [forhandsvarselTexts.lovhjemmel.intro],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: [forhandsvarselTexts.lovhjemmel.pliktInfo1],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: [forhandsvarselTexts.lovhjemmel.pliktInfo2],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: ["Med vennlig hilsen", VEILEDER_DEFAULT.fulltNavn(), "NAV"],
      type: DocumentComponentType.PARAGRAPH,
    },
  ];
};
