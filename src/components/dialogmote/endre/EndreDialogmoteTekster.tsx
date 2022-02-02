import React, { useState } from "react";
import { useFormState } from "react-final-form";
import { Forhandsvisning } from "../Forhandsvisning";
import { EndreTidStedSkjemaValues } from "./EndreDialogmoteSkjema";
import { useForhandsvisTidSted } from "@/hooks/dialogmote/useForhandsvisTidSted";
import FritekstSeksjon from "@/components/dialogmote/FritekstSeksjon";
import { DialogmoteDTO } from "@/data/dialogmote/types/dialogmoteTypes";

export const MAX_LENGTH_ENDRE_BEGRUNNELSE = 200;

export const texts = {
  send: "Lagre endringer",
  avbryt: "Avbryt",
  begrunnelseArbeidsgiver: "Begrunnelse til nærmeste leder",
  begrunnelseArbeidstaker: "Begrunnelse til arbeidstakeren",
  begrunnelseBehandler: "Begrunnelse til behandler",
  forhandsvisningTitle: "Endret dialogmøte",
  forhandsvisningArbeidstakerSubtitle: "(brev til arbeidstakeren)",
  forhandsvisningArbeidstakerContentLabel:
    "Forhåndsvis endring av dialogmøte arbeidstaker",
  forhandsvisningArbeidsgiverSubtitle: "(brev til nærmeste leder)",
  forhandsvisningArbeidsgiverContentLabel:
    "Forhåndsvis endring av dialogmøte arbeidsgiver",
  forhandsvisningBehandlerSubtitle: "(brev til behandler)",
  forhandsvisningBehandlerContentLabel:
    "Forhåndsvis endring av dialogmøte behandler",
};

interface Props {
  dialogmote: DialogmoteDTO;
}

const EndreDialogmoteTekster = ({ dialogmote }: Props) => {
  const { behandler } = dialogmote;
  const { values } = useFormState<EndreTidStedSkjemaValues>();
  const [
    displayEndringArbeidstakerPreview,
    setDisplayEndringArbeidstakerPreview,
  ] = useState(false);
  const [
    displayEndringArbeidsgiverPreview,
    setDisplayEndringArbeidsgiverPreview,
  ] = useState(false);
  const [
    displayEndringBehandlerPreview,
    setDisplayEndringBehandlerPreview,
  ] = useState(false);
  const {
    generateArbeidstakerTidStedDocument,
    generateArbeidsgiverTidStedDocument,
    generateBehandlerTidStedDocument,
  } = useForhandsvisTidSted(dialogmote);

  return (
    <>
      <FritekstSeksjon
        fieldName="begrunnelseArbeidstaker"
        label={texts.begrunnelseArbeidstaker}
        handlePreviewClick={() => setDisplayEndringArbeidstakerPreview(true)}
        maxLength={MAX_LENGTH_ENDRE_BEGRUNNELSE}
      />
      <Forhandsvisning
        title={texts.forhandsvisningTitle}
        subtitle={texts.forhandsvisningArbeidstakerSubtitle}
        contentLabel={texts.forhandsvisningArbeidstakerContentLabel}
        isOpen={displayEndringArbeidstakerPreview}
        handleClose={() => setDisplayEndringArbeidstakerPreview(false)}
        getDocumentComponents={() =>
          generateArbeidstakerTidStedDocument(values)
        }
      />
      <FritekstSeksjon
        fieldName="begrunnelseArbeidsgiver"
        label={texts.begrunnelseArbeidsgiver}
        handlePreviewClick={() => setDisplayEndringArbeidsgiverPreview(true)}
        maxLength={MAX_LENGTH_ENDRE_BEGRUNNELSE}
      />
      <Forhandsvisning
        title={texts.forhandsvisningTitle}
        subtitle={texts.forhandsvisningArbeidsgiverSubtitle}
        contentLabel={texts.forhandsvisningArbeidsgiverContentLabel}
        isOpen={displayEndringArbeidsgiverPreview}
        handleClose={() => setDisplayEndringArbeidsgiverPreview(false)}
        getDocumentComponents={() =>
          generateArbeidsgiverTidStedDocument(values)
        }
      />
      {behandler && (
        <>
          <FritekstSeksjon
            fieldName="begrunnelseBehandler"
            label={texts.begrunnelseBehandler}
            handlePreviewClick={() => setDisplayEndringBehandlerPreview(true)}
            maxLength={MAX_LENGTH_ENDRE_BEGRUNNELSE}
          />
          <Forhandsvisning
            title={texts.forhandsvisningTitle}
            subtitle={texts.forhandsvisningBehandlerSubtitle}
            contentLabel={texts.forhandsvisningBehandlerContentLabel}
            isOpen={displayEndringBehandlerPreview}
            handleClose={() => setDisplayEndringBehandlerPreview(false)}
            getDocumentComponents={() =>
              generateBehandlerTidStedDocument(values)
            }
          />
        </>
      )}
    </>
  );
};

export default EndreDialogmoteTekster;
