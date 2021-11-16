import { DocumentComponentDto } from "@/data/dialogmote/types/dialogmoteTypes";
import { AvlysDialogmoteSkjemaValues } from "@/components/dialogmote/avlys/AvlysDialogmoteSkjema";
import { avlysningTexts } from "@/data/dialogmote/dialogmoteTexts";
import { tilDatoMedManedNavnOgKlokkeslettWithComma } from "@/utils/datoUtils";
import { createParagraph } from "@/utils/documentComponentUtils";
import { useForhandsvisningHilsen } from "./useForhandsvisningHilsen";
import { useForhandsvisningIntro } from "@/hooks/dialogmote/useForhandsvisningIntro";

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
  const {
    introHilsenArbeidstaker,
    introHilsenArbeidsgiver,
    introHilsenBehandler,
  } = useForhandsvisningIntro();
  const introText = createParagraph(
    `${avlysningTexts.intro1} ${tilDatoMedManedNavnOgKlokkeslettWithComma(
      opprinneligTid
    )}. ${avlysningTexts.intro2}`
  );

  const generateAvlysningDocument = (
    values: Partial<AvlysDialogmoteSkjemaValues>,
    introHilsen: DocumentComponentDto,
    begrunnelse?: string
  ) => {
    const documentComponents = [introHilsen, introText];
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
      generateAvlysningDocument(
        values,
        introHilsenArbeidstaker,
        values.begrunnelseArbeidstaker
      ),
    generateAvlysningArbeidsgiverDocument: (
      values: Partial<AvlysDialogmoteSkjemaValues>
    ): DocumentComponentDto[] =>
      generateAvlysningDocument(
        values,
        introHilsenArbeidsgiver,
        values.begrunnelseArbeidsgiver
      ),
    generateAvlysningBehandlerDocument: (
      values: Partial<AvlysDialogmoteSkjemaValues>
    ): DocumentComponentDto[] =>
      generateAvlysningDocument(
        values,
        introHilsenBehandler,
        values.begrunnelseBehandler
      ),
  };
};
