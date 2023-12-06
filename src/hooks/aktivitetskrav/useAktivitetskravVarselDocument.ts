import { DocumentComponentDto } from "@/data/documentcomponent/documentComponentTypes";
import { useDocumentComponents } from "@/hooks/useDocumentComponents";
import {
  createBulletPoints,
  createHeaderH1,
  createHeaderH3,
  createParagraph,
} from "@/utils/documentComponentUtils";
import { Brevmal } from "@/data/aktivitetskrav/aktivitetskravTypes";
import { getForhandsvarselTexts } from "@/data/aktivitetskrav/forhandsvarselTexts";

type ForhandsvarselDocumentValues = {
  begrunnelse: string;
  frist: Date;
  mal: Brevmal;
};

export const useAktivitetskravVarselDocument = (): {
  getForhandsvarselDocument(
    values: ForhandsvarselDocumentValues
  ): DocumentComponentDto[];
} => {
  const { getHilsen } = useDocumentComponents();

  const getForhandsvarselDocument = (values: ForhandsvarselDocumentValues) => {
    const { mal, begrunnelse, frist } = values;
    const sendForhandsvarselTexts = getForhandsvarselTexts({
      mal,
      frist,
    });

    const documentComponents = [
      createHeaderH1(sendForhandsvarselTexts.varselInfo.header),
      createParagraph(sendForhandsvarselTexts.varselInfo.introWithFristDate),
    ];

    if (begrunnelse) {
      documentComponents.push(createParagraph(begrunnelse));
    }

    documentComponents.push(
      createHeaderH3(sendForhandsvarselTexts.unngaStansInfo.header),
      createBulletPoints(
        sendForhandsvarselTexts.unngaStansInfo.tiltak1,
        sendForhandsvarselTexts.unngaStansInfo.tiltak2,
        sendForhandsvarselTexts.unngaStansInfo.tiltak3
      ),

      createHeaderH3(sendForhandsvarselTexts.giOssTilbakemelding.header),
      createParagraph(
        sendForhandsvarselTexts.giOssTilbakemelding.tilbakemeldingWithFristDate
      ),
      createParagraph(sendForhandsvarselTexts.giOssTilbakemelding.kontaktOss),

      createHeaderH3(sendForhandsvarselTexts.lovhjemmel.header),
      createParagraph(sendForhandsvarselTexts.lovhjemmel.aktivitetsplikten),
      createParagraph(sendForhandsvarselTexts.lovhjemmel.pliktInfo),

      getHilsen()
    );

    return documentComponents;
  };

  return {
    getForhandsvarselDocument,
  };
};
