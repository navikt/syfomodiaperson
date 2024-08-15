import { VedtakResponseDTO } from "@/data/frisktilarbeid/frisktilarbeidTypes";
import React from "react";
import { Alert, BodyShort, Box, Button, Heading } from "@navikt/ds-react";
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
};

interface Props {
  vedtak: VedtakResponseDTO;
  setOppgaveAvsluttetNow: () => void;
}

export function VedtakFattet({ vedtak }: Props) {
  const ferdigbehandleVedtak = useFerdigbehandleVedtak(vedtak.uuid);
  const vedtakStartDateText = tilLesbarDatoMedArUtenManedNavn(vedtak.fom);
  const vedtakEndDateText = tilLesbarDatoMedArUtenManedNavn(vedtak.tom);
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
