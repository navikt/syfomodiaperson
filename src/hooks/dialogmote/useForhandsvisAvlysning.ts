import {
  DialogmoteDTO,
  DocumentComponentDto,
} from "@/data/dialogmote/types/dialogmoteTypes";
import { AvlysDialogmoteSkjemaValues } from "@/components/dialogmote/avlys/AvlysDialogmoteSkjema";
import { avlysningTexts } from "@/data/dialogmote/dialogmoteTexts";
import { tilDatoMedManedNavnOgKlokkeslettWithComma } from "@/utils/datoUtils";
import {
  createParagraph,
  createParagraphWithTitle,
} from "@/utils/documentComponentUtils";
import { useForhandsvisningHilsen } from "./useForhandsvisningHilsen";
import { useForhandsvisningIntro } from "@/hooks/dialogmote/useForhandsvisningIntro";
import { useLedere } from "@/hooks/useLedere";

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
  dialogmote: DialogmoteDTO
): ForhandsvisAvlysningGenerator => {
  const hilsen = useForhandsvisningHilsen();

  const sendt = createParagraph(
    `Sendt ${tilDatoMedManedNavnOgKlokkeslettWithComma(new Date())}`
  );

  const {
    introHilsenArbeidstaker,
    introHilsenArbeidsgiver,
    introHilsenBehandler,
  } = useForhandsvisningIntro();
  const introText = createParagraph(
    `${avlysningTexts.intro1} ${tilDatoMedManedNavnOgKlokkeslettWithComma(
      dialogmote.tid
    )}. ${avlysningTexts.intro2}`
  );

  const { getCurrentNarmesteLeder } = useLedere();

  const getValgtArbeidsgiver = (arbeidsgiver) =>
    getCurrentNarmesteLeder(arbeidsgiver.virksomhetsnummer)?.virksomhetsnavn;

  const generateAvlysningDocument = (
    values: Partial<AvlysDialogmoteSkjemaValues>,
    introHilsen: DocumentComponentDto,
    begrunnelse?: string
  ) => {
    const documentComponents = [sendt, introHilsen, introText];
    if (begrunnelse) {
      documentComponents.push(createParagraph(begrunnelse));
    }

    const virksomhetsnavn = getValgtArbeidsgiver(dialogmote.arbeidsgiver);
    if (virksomhetsnavn) {
      documentComponents.push(
        createParagraphWithTitle("Arbeidsgiver", virksomhetsnavn)
      );
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
