import { LocalAlert } from "@navikt/ds-react";

const texts = {
  activeVedtakAlert:
    "Tidligst mulig tidspunkt for å fatte et nytt vedtak er dagen etter forrige vedtak er avsluttet.",
  arbeidssokerAlert:
    "Den sykemeldte er ikke registrert som arbeidssøker. Dette må gjøres før et nytt vedtak kan fattes.",
};

interface Props {
  isActiveVedtak: boolean;
  isRegisteredArbeidssoker: boolean;
  hasArbeidssokerFom: boolean;
}

export default function KanIkkeFatteNyttVedtakAlert({
  isActiveVedtak,
  isRegisteredArbeidssoker,
  hasArbeidssokerFom,
}: Props) {
  if (isActiveVedtak) {
    return (
      <LocalAlert status="warning" size="small" className="max-w-fit">
        <LocalAlert.Header>
          <LocalAlert.Title>{texts.activeVedtakAlert}</LocalAlert.Title>
        </LocalAlert.Header>
      </LocalAlert>
    );
  }
  if (!isRegisteredArbeidssoker || !hasArbeidssokerFom) {
    return (
      <LocalAlert status="warning" size="small" className="max-w-fit">
        <LocalAlert.Header>
          <LocalAlert.Title>{texts.arbeidssokerAlert}</LocalAlert.Title>
        </LocalAlert.Header>
      </LocalAlert>
    );
  }
}
