import {
  InfotrygdStatus,
  VedtakResponseDTO,
} from "@/data/frisktilarbeid/frisktilarbeidTypes";
import React from "react";
import {
  Alert,
  BodyShort,
  Box,
  Button,
  Detail,
  Heading,
} from "@navikt/ds-react";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import { useFerdigbehandleVedtak } from "@/data/frisktilarbeid/useFerdigbehandleVedtak";
import { useNotification } from "@/context/notification/NotificationContext";

const texts = {
  heading: (startDate: string, endDate: string) =>
    `Fattet vedtak varer fra ${startDate} til ${endDate}`,
  avslutt:
    "Etter at du avslutter oppgaven her, fjernes oppgaven fra oversikten og du trenger ikke å foreta deg noe mer.",
  videreOppfolging:
    "Videre oppfølging vil skje i aktivitetsplanen basert på bistandsbehovet i §14a-vedtaket.",
  button: "Avslutt oppgave",
  oppgaveAvsluttetAlert:
    "Oppgaven om vedtak er ferdigbehandlet, og er fjernet fra oversikten.",
  infotrygdAlert:
    "Overføring til Infotrygd feilet. Sjekk Infotrygd og registrer vedtaket manuelt om nødvendig.",
  infotrygdRutine:
    "Registrer 'J' på 'tiltak' på SP SA, trykk F6, legg inn kode FA og periode for friskmelding til arbeidsformidling, trykk F6.",
  infotrygdDisclaimer:
    "Dersom du har rettet opp manuelt i Infotrygd kan du se bort fra denne meldingen.",
};

const visInfotrygdAlert = (status: InfotrygdStatus): boolean => {
  switch (status) {
    case InfotrygdStatus.IKKE_SENDT:
    case InfotrygdStatus.KVITTERING_FEIL:
    case InfotrygdStatus.KVITTERING_MANGLER:
      return true;
    case InfotrygdStatus.KVITTERING_OK:
      return false;
  }
};

interface Props {
  vedtak: VedtakResponseDTO;
}

export function VedtakFattet({
  vedtak: { fom, infotrygdStatus, tom, uuid },
}: Props) {
  const ferdigbehandleVedtak = useFerdigbehandleVedtak(uuid);
  const vedtakStartDateText = tilLesbarDatoMedArUtenManedNavn(fom);
  const vedtakEndDateText = tilLesbarDatoMedArUtenManedNavn(tom);
  const { notification, setNotification } = useNotification();

  function handleAvsluttOppgaveOnClick() {
    ferdigbehandleVedtak.mutate(undefined, {
      onSuccess: () => {
        setNotification({ message: texts.oppgaveAvsluttetAlert });
      },
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {notification && <Alert variant="success">{notification.message}</Alert>}
      {visInfotrygdAlert(infotrygdStatus) && (
        <Alert variant="warning" className="[&>*]:max-w-fit">
          {texts.infotrygdAlert}
          <br />
          <i>{texts.infotrygdRutine}</i>
          <Detail>{texts.infotrygdDisclaimer}</Detail>
        </Alert>
      )}
      <Box
        background="surface-default"
        padding="6"
        className="flex flex-col gap-4"
      >
        <Heading level="2" size="medium">
          {`${texts.heading(vedtakStartDateText, vedtakEndDateText)} `}
        </Heading>
        <BodyShort>{texts.videreOppfolging}</BodyShort>
        <BodyShort>{texts.avslutt}</BodyShort>
        <Button
          className="w-fit"
          loading={ferdigbehandleVedtak.isPending}
          onClick={() => handleAvsluttOppgaveOnClick()}
        >
          {texts.button}
        </Button>
      </Box>
    </div>
  );
}
