import {
  InfotrygdStatus,
  VedtakResponseDTO,
} from "@/data/frisktilarbeid/frisktilarbeidTypes";
import React, { useState } from "react";
import {
  Alert,
  BodyLong,
  Box,
  Button,
  Detail,
  Heading,
} from "@navikt/ds-react";
import { useFerdigbehandleVedtak } from "@/data/frisktilarbeid/useFerdigbehandleVedtak";
import { useNotification } from "@/context/notification/NotificationContext";
import VedtakInfoPanel from "@/sider/frisktilarbeid/VedtakInfoPanel";

const texts = {
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
  oppgaveIPersonoversikten: "Oppgave i Personoversikten",
};

function visInfotrygdAlert(status: InfotrygdStatus): boolean {
  switch (status) {
    case InfotrygdStatus.IKKE_SENDT:
    case InfotrygdStatus.KVITTERING_FEIL:
    case InfotrygdStatus.KVITTERING_MANGLER:
      return true;
    case InfotrygdStatus.KVITTERING_OK:
      return false;
  }
}

interface Props {
  vedtak: VedtakResponseDTO;
  setIsNyVurderingStarted: (value: boolean) => void;
}

export default function VedtakFattet({
  vedtak,
  setIsNyVurderingStarted,
}: Props) {
  const ferdigbehandleVedtak = useFerdigbehandleVedtak(vedtak.uuid);
  const { notification, setNotification } = useNotification();
  const [isNotificationVisible, setIsNotificationVisible] = useState(true);

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
      {notification && isNotificationVisible && (
        <Alert
          variant="success"
          closeButton
          onClose={() => setIsNotificationVisible(false)}
        >
          {notification.message}
        </Alert>
      )}
      {visInfotrygdAlert(vedtak.infotrygdStatus) && (
        <Alert variant="warning" className="[&>*]:max-w-fit" closeButton>
          {texts.infotrygdAlert}
          <br />
          <i>{texts.infotrygdRutine}</i>
          <Detail>{texts.infotrygdDisclaimer}</Detail>
        </Alert>
      )}
      <VedtakInfoPanel vedtak={vedtak} />
      <Box
        background="surface-default"
        padding="6"
        className="flex flex-col gap-4"
      >
        <Heading level="3" size="medium">
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
