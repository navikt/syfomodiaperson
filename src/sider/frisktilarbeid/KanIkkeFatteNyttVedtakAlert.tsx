import React from "react";
import { Alert } from "@navikt/ds-react";

const texts = {
  activeVedtakAlert:
    "Tidligst mulig tidspunkt for å fatte et nytt vedtak er dagen etter forrige vedtak er avsluttet.",
  arbeidssokerAlert:
    "Den sykemeldte er ikke registrert som arbeidssøker. Dette må gjøres før et nytt vedtak kan fattes.",
};

interface Props {
  isActiveVedtak: boolean;
  isRegisteredArbeidssoker: boolean;
}

export default function KanIkkeFatteNyttVedtakAlert({
  isActiveVedtak,
  isRegisteredArbeidssoker,
}: Props) {
  if (isActiveVedtak) {
    return (
      <Alert variant="warning" size="small" className="max-w-fit">
        {texts.activeVedtakAlert}
      </Alert>
    );
  }
  if (!isRegisteredArbeidssoker) {
    return (
      <Alert variant="warning" size="small" className="max-w-fit">
        {texts.arbeidssokerAlert}
      </Alert>
    );
  }
}
