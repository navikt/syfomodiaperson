import React, { ReactElement, useState } from "react";
import { useFormState } from "react-final-form";
import DialogmoteInnkallingSkjemaSeksjon from "./DialogmoteInnkallingSkjemaSeksjon";
import styled from "styled-components";
import { Innholdstittel } from "nav-frontend-typografi";
import { DialogmoteInnkallingSkjemaValues } from "./DialogmoteInnkallingSkjema";
import { useForhandsvisInnkalling } from "@/hooks/dialogmote/useForhandsvisInnkalling";
import { Forhandsvisning } from "../Forhandsvisning";
import FritekstSeksjon from "../FritekstSeksjon";
import { BehandlerDialogmeldingDTO } from "@/data/behandlerdialogmelding/BehandlerDialogmeldingDTO";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";
import { AlertstripeFullbredde } from "@/components/AlertstripeFullbredde";

export const MAX_LENGTH_INNKALLING_FRITEKST = 2000;

export const texts = {
  title: "Tekster i innkallingen",
  arbeidstakerLabel: "Fritekst til arbeidstakeren (valgfri)",
  arbeidsgiverLabel: "Fritekst til nærmeste leder (valgfri)",
  behandlerLabel: "Fritekst til behandler (valgfri)",
  forhandsvisningTitle: "Innkalling til dialogmøte",
  forhandsvisningArbeidstakerSubtitle: "(brev til arbeidstakeren)",
  forhandsvisningArbeidstakerContentLabel:
    "Forhåndsvis innkalling til dialogmøte arbeidstaker",
  forhandsvisningArbeidsgiverSubtitle: "(brev til nærmeste leder)",
  forhandsvisningArbeidsgiverContentLabel:
    "Forhåndsvis innkalling til dialogmøte arbeidsgiver",
  forhandsvisningBehandlerSubtitle: "(brev til behandler)",
  forhandsvisningBehandlerContentLabel:
    "Forhåndsvis innkalling til dialogmøte behandler",
  reservertAlert:
    "Denne arbeidstakeren vil få brevet sendt som papirpost. Du kan inkludere telefonnummeret til kontaktsenteret i fritekstfeltet (55 55 33 33), slik at arbeidstakeren kan ta kontakt på telefon hvis tidspunktet ikke passer.",
};

const TeksterTittel = styled(Innholdstittel)`
  margin-bottom: 0.5em;
`;
const ReservertAlert = styled(AlertstripeFullbredde)`
  margin-bottom: 1em;
`;

interface DialogmoteInnkallingTeksterProps {
  selectedBehandler: BehandlerDialogmeldingDTO | undefined;
}

const DialogmoteInnkallingTekster = ({
  selectedBehandler,
}: DialogmoteInnkallingTeksterProps): ReactElement => {
  const { brukerKanIkkeVarslesDigitalt } = useNavBrukerData();
  const { values } = useFormState<DialogmoteInnkallingSkjemaValues>();
  const [
    displayInnkallingArbeidstakerPreview,
    setDisplayInnkallingArbeidstakerPreview,
  ] = useState(false);
  const [
    displayInnkallingArbeidsgiverPreview,
    setDisplayInnkallingArbeidsgiverPreview,
  ] = useState(false);

  const [
    displayInnkallingBehandlerPreview,
    setDisplayInnkallingBehandlerPreview,
  ] = useState(false);

  const {
    generateArbeidstakerInnkallingDocument,
    generateArbeidsgiverInnkallingDocument,
    generateBehandlerInnkallingDocument,
  } = useForhandsvisInnkalling();

  return (
    <DialogmoteInnkallingSkjemaSeksjon>
      <TeksterTittel>{texts.title}</TeksterTittel>
      {brukerKanIkkeVarslesDigitalt && (
        <ReservertAlert type="advarsel">{texts.reservertAlert}</ReservertAlert>
      )}
      <FritekstSeksjon
        fieldName="fritekstArbeidstaker"
        label={texts.arbeidstakerLabel}
        handlePreviewClick={() => setDisplayInnkallingArbeidstakerPreview(true)}
        maxLength={MAX_LENGTH_INNKALLING_FRITEKST}
      />
      <Forhandsvisning
        title={texts.forhandsvisningTitle}
        subtitle={texts.forhandsvisningArbeidstakerSubtitle}
        contentLabel={texts.forhandsvisningArbeidstakerContentLabel}
        isOpen={displayInnkallingArbeidstakerPreview}
        handleClose={() => setDisplayInnkallingArbeidstakerPreview(false)}
        getDocumentComponents={() =>
          generateArbeidstakerInnkallingDocument(values, selectedBehandler)
        }
      />
      <FritekstSeksjon
        fieldName="fritekstArbeidsgiver"
        label={texts.arbeidsgiverLabel}
        handlePreviewClick={() => setDisplayInnkallingArbeidsgiverPreview(true)}
        maxLength={MAX_LENGTH_INNKALLING_FRITEKST}
      />
      <Forhandsvisning
        title={texts.forhandsvisningTitle}
        subtitle={texts.forhandsvisningArbeidsgiverSubtitle}
        contentLabel={texts.forhandsvisningArbeidsgiverContentLabel}
        isOpen={displayInnkallingArbeidsgiverPreview}
        handleClose={() => setDisplayInnkallingArbeidsgiverPreview(false)}
        getDocumentComponents={() =>
          generateArbeidsgiverInnkallingDocument(values, selectedBehandler)
        }
      />

      {!!selectedBehandler && (
        <>
          <FritekstSeksjon
            fieldName="fritekstBehandler"
            label={texts.behandlerLabel}
            handlePreviewClick={() =>
              setDisplayInnkallingBehandlerPreview(true)
            }
            maxLength={MAX_LENGTH_INNKALLING_FRITEKST}
          />
          <Forhandsvisning
            title={texts.forhandsvisningTitle}
            subtitle={texts.forhandsvisningBehandlerSubtitle}
            contentLabel={texts.forhandsvisningBehandlerContentLabel}
            isOpen={displayInnkallingBehandlerPreview}
            handleClose={() => setDisplayInnkallingBehandlerPreview(false)}
            getDocumentComponents={() =>
              generateBehandlerInnkallingDocument(values)
            }
          />
        </>
      )}
    </DialogmoteInnkallingSkjemaSeksjon>
  );
};

export default DialogmoteInnkallingTekster;
