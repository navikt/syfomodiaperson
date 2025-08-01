import {
  InfotrygdStatus,
  VedtakResponseDTO,
} from "@/data/frisktilarbeid/frisktilarbeidTypes";
import React from "react";
import {
  Alert,
  BodyLong,
  BodyShort,
  Box,
  Button,
  Detail,
  Heading,
} from "@navikt/ds-react";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import { useFerdigbehandleVedtak } from "@/data/frisktilarbeid/useFerdigbehandleVedtak";
import { useNotification } from "@/context/notification/NotificationContext";
import { CheckmarkCircleIcon } from "@navikt/aksel-icons";

const texts = {
  heading: (startDate: string, endDate: string) =>
    `Fattet vedtak varer fra ${startDate} til ${endDate}`,
  videreOppfolging:
    "Videre oppfølging vil skje i aktivitetsplanen basert på bistandsbehovet i §14a-vedtaket.",
  button: "Fjern oppgaven fra oversikten",
  oppgaveFjernetAlert:
    "Oppgaven om vedtak er ferdigbehandlet, og er fjernet fra oversikten.",
  infotrygdAlert:
    "Overføring til Infotrygd feilet. Sjekk Infotrygd og registrer vedtaket manuelt om nødvendig.",
  infotrygdRutine:
    "Registrer 'J' på 'tiltak' på SP SA, trykk F6, legg inn kode FA og periode for friskmelding til arbeidsformidling, trykk F6.",
  infotrygdDisclaimer:
    "Dersom du har rettet opp manuelt i Infotrygd kan du se bort fra denne meldingen.",
  aktivtVedtak: "Aktivt vedtak",
  ikkeMuligMedNyttVedtak:
    "Det er ikke mulig å fatte et nytt vedtak når det foreligger et aktivt vedtak.",
  gosysOppgaveSendt: "Gosys oppgaven er automatisk sendt til NAY.",
  vedtakJournalfort: "Vedtaket er journalført i Gosys.",
  oppgaveIPersonoversikten: "Oppgave i Personoversikten",
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
  setIsNyVurderingStarted: (value: boolean) => void;
}

export default function VedtakFattet({
  vedtak: { createdAt, fom, infotrygdStatus, tom, uuid },
  setIsNyVurderingStarted,
}: Props) {
  const ferdigbehandleVedtak = useFerdigbehandleVedtak(uuid);
  const vedtakFattetDate = tilLesbarDatoMedArUtenManedNavn(createdAt);
  const vedtakStartDateText = tilLesbarDatoMedArUtenManedNavn(fom);
  const vedtakEndDateText = tilLesbarDatoMedArUtenManedNavn(tom);
  const { notification, setNotification } = useNotification();

  function handleFjernOppgaveOnClick() {
    ferdigbehandleVedtak.mutate(undefined, {
      onSuccess: () => {
        setNotification({ message: texts.oppgaveFjernetAlert });
        setIsNyVurderingStarted(false);
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
          {texts.aktivtVedtak}
        </Heading>
        <BodyShort>{texts.ikkeMuligMedNyttVedtak}</BodyShort>
        <Box background="surface-subtle" className="flex flex-col p-4 gap-2">
          <div>
            <div className="flex flex-row gap-4">
              <BodyShort>
                Start: <b>{vedtakStartDateText}</b>
              </BodyShort>
              <BodyShort>
                Slutt: <b>{vedtakEndDateText}</b>
              </BodyShort>
            </div>
            <BodyShort>
              Vedtaket ble fattet: <b>{vedtakFattetDate}</b>
            </BodyShort>
          </div>
          <div className="flex flex-row gap-2">
            <CheckmarkCircleIcon
              color="green"
              title="a11y-title"
              fontSize="1.5rem"
            />
            <BodyShort>{texts.gosysOppgaveSendt}</BodyShort>
          </div>
          <div className="flex flex-row gap-2">
            <CheckmarkCircleIcon
              color="green"
              title="a11y-title"
              fontSize="1.5rem"
            />
            <BodyShort>{texts.vedtakJournalfort}</BodyShort>
          </div>
        </Box>
      </Box>
      <Box
        background="surface-default"
        padding="6"
        className="flex flex-col gap-4"
      >
        <Heading level="2" size="medium">
          {texts.oppgaveIPersonoversikten}
        </Heading>
        <BodyLong>{texts.videreOppfolging}</BodyLong>
        <Button
          className="w-fit"
          variant="secondary"
          loading={ferdigbehandleVedtak.isPending}
          onClick={() => handleFjernOppgaveOnClick()}
        >
          {texts.button}
        </Button>
      </Box>
    </div>
  );
}
