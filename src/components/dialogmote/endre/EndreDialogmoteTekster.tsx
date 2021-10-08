import React, { useState } from "react";
import { useFormState } from "react-final-form";
import { Forhandsvisning } from "../Forhandsvisning";
import { EndreTidStedSkjemaValues } from "./EndreDialogmoteSkjema";
import { useForhandsvisTidSted } from "@/hooks/dialogmote/useForhandsvisTidSted";
import FritekstSeksjon from "@/components/dialogmote/FritekstSeksjon";

export const MAX_LENGTH_ENDRE_BEGRUNNELSE = 200;

export const texts = {
  send: "Lagre endringer",
  avbryt: "Avbryt",
  begrunnelseArbeidsgiver: "Begrunnelse til nærmeste leder",
  begrunnelseArbeidstaker: "Begrunnelse til arbeidstakeren",
  forhandsvisningTitle: "Endret dialogmøte",
  forhandsvisningArbeidstakerSubtitle: "(brev til arbeidstakeren)",
  forhandsvisningArbeidstakerContentLabel:
    "Forhåndsvis endring av dialogmøte arbeidstaker",
  forhandsvisningArbeidsgiverSubtitle: "(brev til nærmeste leder)",
  forhandsvisningArbeidsgiverContentLabel:
    "Forhåndsvis endring av dialogmøte arbeidsgiver",
};

interface Props {
  opprinneligTid: string;
}

const EndreDialogmoteTekster = ({ opprinneligTid }: Props) => {
  const { values } = useFormState<EndreTidStedSkjemaValues>();
  const [
    displayEndringArbeidstakerPreview,
    setDisplayEndringArbeidstakerPreview,
  ] = useState(false);
  const [
    displayEndringArbeidsgiverPreview,
    setDisplayEndringArbeidsgiverPreview,
  ] = useState(false);
  const {
    generateArbeidstakerTidStedDocument,
    generateArbeidsgiverTidStedDocument,
  } = useForhandsvisTidSted();

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
          generateArbeidstakerTidStedDocument(values, opprinneligTid)
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
          generateArbeidsgiverTidStedDocument(values, opprinneligTid)
        }
      />
    </>
  );
};

export default EndreDialogmoteTekster;
