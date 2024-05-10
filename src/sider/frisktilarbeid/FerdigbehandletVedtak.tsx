import React, { ReactElement, useState } from "react";
import { Alert, BodyLong, Box, Button, Heading } from "@navikt/ds-react";
import dayjs from "dayjs";
import { tilDatoMedManedNavn } from "@/utils/datoUtils";
import { FattNyttVedtak } from "@/sider/frisktilarbeid/FattNyttVedtak";
import { VedtakResponseDTO } from "@/data/frisktilarbeid/frisktilarbeidTypes";

const texts = {
  heading: "Start nytt vedtak",
  forrigeVedtakInfo: (
    vedtakFattetDato: string,
    hasVedtakStarted: boolean,
    hasVedtakEnded: boolean,
    vedtakStartDate: string,
    vedtakEndDate: string
  ) => {
    const vedtakStartText = hasVedtakStarted
      ? `ble startet: ${vedtakStartDate}`
      : `starter: ${vedtakStartDate}`;
    const vedtakEndText = hasVedtakEnded
      ? `ble avsluttet: ${vedtakEndDate}`
      : `avsluttes: ${vedtakEndDate}`;
    return `Forrige vedtak på denne personen ble fattet ${vedtakFattetDato}. Perioden for friskmelding til arbeidsformidling ${vedtakStartText} og ${vedtakEndText}.`;
  },
  nyttVedtak: "Nytt vedtak",
  vedtatFerdigbehandletAlert:
    "Oppgaven om vedtak er ferdigbehandlet, og er fjernet fra oversikten.",
};

interface Props {
  vedtak: VedtakResponseDTO;
}

export function FerdigbehandletVedtak({ vedtak }: Props): ReactElement {
  const [isNyVurderingStarted, setStartNyVurdering] = useState(false);
  const hasVedtakStarted = dayjs(vedtak.fom).isBefore(dayjs());
  const hasVedtakEnded = dayjs(vedtak.tom).isBefore(dayjs());
  const vedtakStartDato = tilDatoMedManedNavn(vedtak.fom);
  const vedtakAvsluttetDato = tilDatoMedManedNavn(vedtak.tom);
  const vedtakFattetDato = tilDatoMedManedNavn(vedtak.createdAt);

  return isNyVurderingStarted ? (
    <FattNyttVedtak />
  ) : (
    <>
      <Alert variant={"success"} className="mb-4">
        {texts.vedtatFerdigbehandletAlert}
      </Alert>
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
              hasVedtakStarted,
              hasVedtakEnded,
              vedtakStartDato,
              vedtakAvsluttetDato
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
