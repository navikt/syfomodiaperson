import { DocumentComponentDto } from "@/data/dialogmote/types/dialogmoteTypes";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";
import { AvlysDialogmoteSkjemaValues } from "@/components/dialogmote/avlys/AvlysDialogmoteSkjema";
import { avlysningTexts } from "@/data/dialogmote/dialogmoteTexts";
import { tilDatoMedManedNavnOgKlokkeslettWithComma } from "@/utils/datoUtils";
import { createParagraph } from "@/utils/documentComponentUtils";
import { useForhandsvisningHilsen } from "./useForhandsvisningHilsen";

export interface ForhandsvisAvlysningGenerator {
  generateAvlysningArbeidstakerDocument(
    values: Partial<AvlysDialogmoteSkjemaValues>
  ): DocumentComponentDto[];

  generateAvlysningArbeidsgiverDocument(
    values: Partial<AvlysDialogmoteSkjemaValues>
  ): DocumentComponentDto[];

  generateAvlysningBehandlerDocument(
    values: Partial<AvlysDialogmoteSkjemaValues>
  ): DocumentComponentDto[];
}

export const useForhandsvisAvlysning = (
  opprinneligTid: string
): ForhandsvisAvlysningGenerator => {
  const hilsen = useForhandsvisningHilsen();
  const navBruker = useNavBrukerData();
  const gjelderText = createParagraph(
    `Gjelder ${navBruker.navn}, f.nr. ${navBruker.kontaktinfo.fnr}.`
  );
  const introText = createParagraph(
    `${avlysningTexts.intro1} ${tilDatoMedManedNavnOgKlokkeslettWithComma(
      opprinneligTid
    )}. ${avlysningTexts.intro2}`
  );

  const generateAvlysningDocument = (
    values: Partial<AvlysDialogmoteSkjemaValues>,
    begrunnelse?: string
  ) => {
    const documentComponents = [gjelderText, introText];
    if (begrunnelse) {
      documentComponents.push(createParagraph(begrunnelse));
    }
    documentComponents.push(...hilsen);

    return documentComponents;
  };

  return {
    generateAvlysningArbeidstakerDocument: (
      values: Partial<AvlysDialogmoteSkjemaValues>
    ): DocumentComponentDto[] =>
      generateAvlysningDocument(values, values.begrunnelseArbeidstaker),
    generateAvlysningArbeidsgiverDocument: (
      values: Partial<AvlysDialogmoteSkjemaValues>
    ): DocumentComponentDto[] =>
      generateAvlysningDocument(values, values.begrunnelseArbeidsgiver),
    generateAvlysningBehandlerDocument: (
      values: Partial<AvlysDialogmoteSkjemaValues>
    ): DocumentComponentDto[] =>
      generateAvlysningDocument(values, values.begrunnelseBehandler),
  };
};
