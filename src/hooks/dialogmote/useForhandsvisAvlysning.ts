import {
  DialogmoteDTO,
  DocumentComponentDto,
} from "../../data/dialogmote/types/dialogmoteTypes";
import { useNavBrukerData } from "../../data/navbruker/navbruker_hooks";
import { AvlysDialogmoteSkjemaValues } from "../../components/dialogmote/avlys/AvlysDialogmoteSkjema";
import { avlysningTexts } from "../../data/dialogmote/dialogmoteTexts";
import { tilDatoMedManedNavnOgKlokkeslettWithComma } from "../../utils/datoUtils";
import { createParagraph } from "../../utils/documentComponentUtils";
import { useForhandsvisningHilsen } from "./useForhandsvisningHilsen";

export interface ForhandsvisAvlysningGenerator {
  generateAvlysningArbeidstakerDocument(
    values: Partial<AvlysDialogmoteSkjemaValues>
  ): DocumentComponentDto[];

  generateAvlysningArbeidsgiverDocument(
    values: Partial<AvlysDialogmoteSkjemaValues>
  ): DocumentComponentDto[];
}

export const useForhandsvisAvlysning = (
  dialogmote: DialogmoteDTO
): ForhandsvisAvlysningGenerator => {
  const hilsen = useForhandsvisningHilsen();
  const navBruker = useNavBrukerData();
  const gjelderText = createParagraph(
    `Gjelder ${navBruker.navn}, f.nr. ${navBruker.kontaktinfo.fnr}.`
  );
  const introText = createParagraph(
    `${avlysningTexts.intro1} ${tilDatoMedManedNavnOgKlokkeslettWithComma(
      dialogmote.tid
    )}. ${avlysningTexts.intro2}`
  );

  const generateAvlysningArbeidstakerDocument = (
    values: Partial<AvlysDialogmoteSkjemaValues>
  ): DocumentComponentDto[] => {
    const documentComponents = [gjelderText, introText];
    if (values.begrunnelseArbeidstaker) {
      documentComponents.push(createParagraph(values.begrunnelseArbeidstaker));
    }
    documentComponents.push(...hilsen);
    return documentComponents;
  };

  const generateAvlysningArbeidsgiverDocument = (
    values: Partial<AvlysDialogmoteSkjemaValues>
  ): DocumentComponentDto[] => {
    const documentComponents = [gjelderText, introText];
    if (values.begrunnelseArbeidsgiver) {
      documentComponents.push(createParagraph(values.begrunnelseArbeidsgiver));
    }
    documentComponents.push(...hilsen);
    return documentComponents;
  };

  return {
    generateAvlysningArbeidstakerDocument,
    generateAvlysningArbeidsgiverDocument,
  };
};
