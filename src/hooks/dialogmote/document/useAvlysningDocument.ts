import {
  DialogmoteDTO,
  DocumentComponentDto,
} from "@/data/dialogmote/types/dialogmoteTypes";
import { AvlysDialogmoteSkjemaValues } from "@/components/dialogmote/avlys/AvlysDialogmoteSkjema";
import { avlysningTexts } from "@/data/dialogmote/dialogmoteTexts";
import { tilDatoMedManedNavnOgKlokkeslettWithComma } from "@/utils/datoUtils";
import {
  createHeaderH1,
  createParagraph,
} from "@/utils/documentComponentUtils";
import { useDocumentComponents } from "@/hooks/dialogmote/document/useDocumentComponents";

export interface IAvlysningDocument {
  getAvlysningDocumentArbeidstaker(
    values: Partial<AvlysDialogmoteSkjemaValues>
  ): DocumentComponentDto[];

  getAvlysningDocumentArbeidsgiver(
    values: Partial<AvlysDialogmoteSkjemaValues>
  ): DocumentComponentDto[];

  getAvlysningDocumentBehandler(
    values: Partial<AvlysDialogmoteSkjemaValues>
  ): DocumentComponentDto[];
}

export const useAvlysningDocument = (
  dialogmote: DialogmoteDTO
): IAvlysningDocument => {
  const {
    getHilsen,
    getIntroHei,
    getIntroGjelder,
    getVirksomhetsnavn,
  } = useDocumentComponents();

  const sendt = createParagraph(
    `Sendt ${tilDatoMedManedNavnOgKlokkeslettWithComma(new Date())}`
  );

  const introText = createParagraph(
    `${avlysningTexts.intro1} ${tilDatoMedManedNavnOgKlokkeslettWithComma(
      dialogmote.tid
    )}. ${avlysningTexts.intro2}`
  );

  const getAvlysningDocument = (
    values: Partial<AvlysDialogmoteSkjemaValues>,
    introHilsen: DocumentComponentDto,
    begrunnelse?: string
  ) => {
    const documentComponents = [
      createHeaderH1("Avlysning av dialogmøte"),
      sendt,
      introHilsen,
      introText,
    ];
    if (begrunnelse) {
      documentComponents.push(createParagraph(begrunnelse));
    }

    const virksomhetsnavn = getVirksomhetsnavn(
      dialogmote.arbeidsgiver.virksomhetsnummer
    );
    if (virksomhetsnavn) {
      documentComponents.push(virksomhetsnavn);
    }

    documentComponents.push(getHilsen());

    return documentComponents;
  };

  return {
    getAvlysningDocumentArbeidstaker: (
      values: Partial<AvlysDialogmoteSkjemaValues>
    ): DocumentComponentDto[] =>
      getAvlysningDocument(
        values,
        getIntroHei(),
        values.begrunnelseArbeidstaker
      ),
    getAvlysningDocumentArbeidsgiver: (
      values: Partial<AvlysDialogmoteSkjemaValues>
    ): DocumentComponentDto[] =>
      getAvlysningDocument(
        values,
        getIntroGjelder(),
        values.begrunnelseArbeidsgiver
      ),
    getAvlysningDocumentBehandler: (
      values: Partial<AvlysDialogmoteSkjemaValues>
    ): DocumentComponentDto[] =>
      getAvlysningDocument(
        values,
        getIntroGjelder(),
        values.begrunnelseBehandler
      ),
  };
};
