import React, { ReactElement, useState } from "react";
import { useFormState } from "react-final-form";
import DialogmoteInnkallingSkjemaSeksjon from "./DialogmoteInnkallingSkjemaSeksjon";
import styled from "styled-components";
import { Innholdstittel } from "nav-frontend-typografi";
import {
  DialogmoteInnkallingRouteStateProps,
  DialogmoteInnkallingSkjemaValues,
} from "./DialogmoteInnkallingSkjema";
import { useForhandsvisInnkalling } from "@/hooks/dialogmote/useForhandsvisInnkalling";
import { Forhandsvisning } from "../Forhandsvisning";
import FritekstSeksjon from "../FritekstSeksjon";
import { DialogmoteInnkallingTeksterAlert } from "./DialogmoteInnkallingTeksterAlert";
import { useLocation } from "react-router-dom";

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
};

const TeksterTittel = styled(Innholdstittel)`
  margin-bottom: 0.5em;
`;

const DialogmoteInnkallingTekster = (): ReactElement => {
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

  const location = useLocation<DialogmoteInnkallingRouteStateProps>();

  const valgtBehandler = location.state?.valgtBehandler;

  return (
    <DialogmoteInnkallingSkjemaSeksjon>
      <TeksterTittel>{texts.title}</TeksterTittel>
      <DialogmoteInnkallingTeksterAlert />
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
          generateArbeidstakerInnkallingDocument(values, valgtBehandler)
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
          generateArbeidsgiverInnkallingDocument(values, valgtBehandler)
        }
      />

      {!!valgtBehandler && (
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
