import { DocumentComponentDto } from "@/data/documentcomponent/documentComponentTypes";
import {
  createHeaderH1,
  createParagraph,
  createParagraphWithTitle,
} from "@/utils/documentComponentUtils";
import { useDocumentComponents } from "@/hooks/useDocumentComponents";
import {
  getForhandsvarselManglendeMedvirkningTexts,
  getUnntakManglendeMedvirkningTexts,
  getIkkeAktuellManglendeMedvirkningTexts,
  getOppfyltManglendeMedvirkningTexts,
  getStansTexts,
} from "@/data/manglendemedvirkning/manglendeMedvirkningDocumentTexts";

type ForhandsvarselDocumentValues = {
  begrunnelse: string;
  frist: Date;
};

type OppfyltDocumentValues = {
  begrunnelse: string;
  forhandsvarselSendtDato: Date;
};

type UnntakDocumentValues = {
  begrunnelse: string;
  forhandsvarselSendtDato: Date;
};

type IkkeAktuellDocumentValues = {
  begrunnelse: string;
};

type StansDocumentValues = {
  begrunnelse: string;
  varselSvarfrist: Date;
};

interface Documents {
  getForhandsvarselDocument(
    values: ForhandsvarselDocumentValues
  ): DocumentComponentDto[];

  getUnntakDocument(values: UnntakDocumentValues): DocumentComponentDto[];

  getOppfyltDocument(values: OppfyltDocumentValues): DocumentComponentDto[];

  getIkkeAktuellDocument(
    values: IkkeAktuellDocumentValues
  ): DocumentComponentDto[];

  getStansDocument(values: StansDocumentValues): DocumentComponentDto[];
}

export function useManglendeMedvirkningVurderingDocument(): Documents {
  const { getHilsen, getVurdertAv, getIntroGjelder, getVeiledernavn } =
    useDocumentComponents();

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

  function getUnntakDocument(
    values: UnntakDocumentValues
  ): DocumentComponentDto[] {
    const unntakTexts = getUnntakManglendeMedvirkningTexts(
      values.forhandsvarselSendtDato
    );
    return [
      createHeaderH1(unntakTexts.title),
      getIntroGjelder(),
      createParagraph(unntakTexts.info.p1),
      createParagraph(unntakTexts.info.p2),
      createParagraph(values.begrunnelse),
      createParagraph(unntakTexts.loven),
      getVurdertAv(),
    ];
  }

  const getIkkeAktuellDocument = ({
    begrunnelse,
  }: IkkeAktuellDocumentValues) => {
    const ikkeAktuellTexts = getIkkeAktuellManglendeMedvirkningTexts();
    return [
      createHeaderH1(ikkeAktuellTexts.title),
      getIntroGjelder(),
      createParagraph(ikkeAktuellTexts.intro),
      createParagraph(begrunnelse),
      getVurdertAv(),
    ];
  };

  function getStansDocument(
    values: StansDocumentValues
  ): DocumentComponentDto[] {
    const stansTexts = getStansTexts(values.varselSvarfrist);
    return [
      createHeaderH1(stansTexts.header),
      createParagraph(stansTexts.fom),
      createParagraph(stansTexts.intro),
      createParagraph(values.begrunnelse),
      createParagraph(stansTexts.hjemmel),
      getVeiledernavn(),
    ];
  }

  return {
    getForhandsvarselDocument,
    getUnntakDocument,
    getOppfyltDocument,
    getIkkeAktuellDocument,
    getStansDocument,
  };
}
