import React from "react";
import { Alert } from "@navikt/ds-react";

const texts = {
  activeVedtakAlert:
    "Det er allerede fattet et kommende eller aktivt vedtak for denne personen. Det er ikke mulig å fatte et nytt vedtak før perioden for det eksisterende vedtaket er ferdig.",
  arbeidssokerAlert:
    "Den sykemeldte er ikke registrert som arbeidssøker. Dette må gjøres før et nytt vedtak kan fattes.",
};

interface Props {
  isActiveVedtak: boolean;
  isNotArbeidssoker: boolean;
}

export default function VilkarForNewVedtakNotMetAlert({
  isActiveVedtak,
  isNotArbeidssoker,
}: Props) {
  if (isActiveVedtak) {
    return (
      <Alert variant="warning" size="small">
        {texts.activeVedtakAlert}
      </Alert>
    );
  }
  if (isNotArbeidssoker) {
    return (
      <Alert variant="warning" size="small">
        {texts.arbeidssokerAlert}
      </Alert>
    );
  }
}
