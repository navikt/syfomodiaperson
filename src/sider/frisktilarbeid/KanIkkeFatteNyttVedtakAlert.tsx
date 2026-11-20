import { InfoCard } from "@navikt/ds-react";
import { ExclamationmarkTriangleIcon } from "@navikt/aksel-icons";

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
      <InfoCard data-color="warning" size="small" className="max-w-fit">
        <InfoCard.Message icon={<ExclamationmarkTriangleIcon aria-hidden />}>
          {texts.activeVedtakAlert}
        </InfoCard.Message>
      </InfoCard>
    );
  }
  if (!isRegisteredArbeidssoker || !hasArbeidssokerFom) {
    return (
      <InfoCard data-color="warning" size="small" className="max-w-fit">
        <InfoCard.Message icon={<ExclamationmarkTriangleIcon aria-hidden />}>
          {texts.arbeidssokerAlert}
        </InfoCard.Message>
      </InfoCard>
    );
  }
}
