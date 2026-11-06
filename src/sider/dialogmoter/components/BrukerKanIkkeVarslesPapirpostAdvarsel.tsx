import { BodyShort, InfoCard } from "@navikt/ds-react";
import { ExclamationmarkTriangleIcon } from "@navikt/aksel-icons";

export const texts = {
  title: "Innbyggeren kan ikke varsles digitalt",
  papirpostDialogmote:
    "Innkalling, referat og andre brev blir sendt som papirpost, i tillegg til at det blir sendt digitalt.",
  brukerKanIkkeVarslesTekst:
    "Innbyggeren er reservert mot elektronisk kommunikasjon med det offentlige, eller kontaktinformasjon mangler. Vi kan derfor ikke sende varsler til denne innbyggeren.",
};

export function BrukerKanIkkeVarslesPapirpostAdvarsel() {
  return (
    <InfoCard data-color="warning" size="small" className="mb-4">
      <InfoCard.Header icon={<ExclamationmarkTriangleIcon aria-hidden />}>
        <InfoCard.Title>{texts.title}</InfoCard.Title>
      </InfoCard.Header>
      <InfoCard.Content>
        <BodyShort size="small">{texts.brukerKanIkkeVarslesTekst}</BodyShort>
        <BodyShort size="small">{texts.papirpostDialogmote}</BodyShort>
      </InfoCard.Content>
    </InfoCard>
  );
}
