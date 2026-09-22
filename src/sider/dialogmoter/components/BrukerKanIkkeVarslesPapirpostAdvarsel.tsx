import { Alert, BodyShort } from "@navikt/ds-react";
import { ReactElement } from "react";

export const texts = {
  papirpostDialogmote:
    "Innkalling, referat og andre brev blir sendt som papirpost, i tillegg til at det blir sendt digitalt.",
  brukerKanIkkeVarslesTekst:
    "Innbyggeren er reservert mot elektronisk kommunikasjon med det offentlige, eller kontaktinformasjon mangler. Vi kan derfor ikke sende varsler til denne innbyggeren.",
};

export const BrukerKanIkkeVarslesPapirpostAdvarsel = (): ReactElement => (
  <Alert variant="warning" size="small" className="mb-4 [&>*]:max-w-fit">
    <BodyShort size="small">{texts.brukerKanIkkeVarslesTekst}</BodyShort>
    <BodyShort size="small">{texts.papirpostDialogmote}</BodyShort>
  </Alert>
);
