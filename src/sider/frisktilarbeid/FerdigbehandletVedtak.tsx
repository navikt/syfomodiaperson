import React, { ReactElement } from "react";
import { Alert, BodyLong, Box, Button, Heading } from "@navikt/ds-react";
import dayjs from "dayjs";
import { tilDatoMedManedNavn } from "@/utils/datoUtils";
import { VedtakResponseDTO } from "@/data/frisktilarbeid/frisktilarbeidTypes";
import { useNotification } from "@/context/notification/NotificationContext";

const texts = {
  heading: "Start nytt vedtak",
  forrigeVedtakInfo: (
    vedtakFattetDato: string,
    vedtakStartText: string,
    vedtakEndText: string
  ) => {
    return `Forrige vedtak på denne personen ble fattet ${vedtakFattetDato}. Perioden for friskmelding til arbeidsformidling ${vedtakStartText} og ${vedtakEndText}.`;
  },
  nyttVedtak: "Nytt vedtak",
};

interface Props {
  vedtak: VedtakResponseDTO;
  setStartNyVurdering: (value: boolean) => void;
}

export function FerdigbehandletVedtak({
  vedtak,
  setStartNyVurdering,
}: Props): ReactElement {
  const { notification } = useNotification();
  const hasVedtakStarted = dayjs(vedtak.fom).isBefore(dayjs());
  const hasVedtakEnded = dayjs(vedtak.tom).isBefore(dayjs());
  const vedtakStartDato = tilDatoMedManedNavn(vedtak.fom);
  const vedtakAvsluttetDato = tilDatoMedManedNavn(vedtak.tom);
  const vedtakFattetDato = tilDatoMedManedNavn(vedtak.createdAt);
  const vedtakStartText = hasVedtakStarted
    ? `ble startet: ${vedtakStartDato}`
    : `starter: ${vedtakStartDato}`;
  const vedtakEndText = hasVedtakEnded
    ? `ble avsluttet: ${vedtakAvsluttetDato}`
    : `avsluttes: ${vedtakAvsluttetDato}`;

  return (
    <>
      {notification && (
        <Alert variant={"success"} className="mb-4">
          {notification.message}
        </Alert>
      )}
      <div className="flex flex-col gap-4">
        <Box
          background="surface-default"
          padding="6"
          className="flex flex-col gap-4"
        >
          <Heading level="2" size="medium">
            {texts.heading}
          </Heading>
          <BodyLong>
            {texts.forrigeVedtakInfo(
              vedtakFattetDato,
              vedtakStartText,
              vedtakEndText
            )}
          </BodyLong>
          <Button className="w-fit" onClick={() => setStartNyVurdering(true)}>
            {texts.nyttVedtak}
          </Button>
        </Box>
      </div>
    </>
  );
}
