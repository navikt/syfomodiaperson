import React, { ReactElement, useState } from "react";
import { BodyLong, Box, Button, Heading } from "@navikt/ds-react";
import dayjs from "dayjs";
import { tilDatoMedManedNavn } from "@/utils/datoUtils";
import { FattNyttVedtak } from "@/sider/frisktilarbeid/FattNyttVedtak";
import { VedtakResponseDTO } from "@/data/frisktilarbeid/frisktilarbeidTypes";

const texts = {
  heading: "Start ny vurdering av nytt vedtak",
  vedtakBleFattet: (forrigeVedtakDate: string) =>
    `Oppgaven er avsluttet og fjernet fra oversikten. Det forrige vedtaket ble gjort ${forrigeVedtakDate}`,
  forrigeVedtakInfo: (
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
    return `Forrige friskmelding til arbeidsformidling på denne brukeren ${vedtakStartText} og ${vedtakEndText}.`;
  },
  nyttVedtak: "Nytt vedtak",
};

interface Props {
  vedtak: VedtakResponseDTO;
}

export function FerdigbehandletVedtak({ vedtak }: Props): ReactElement {
  const [isNyVurderingStarted, setIsNyVurderingStarted] = useState(false);
  const hasVedtakStarted = dayjs(vedtak.fom).isBefore(dayjs());
  const hasVedtakEnded = dayjs(vedtak.tom).isBefore(dayjs());
  const vedtakStartDato = tilDatoMedManedNavn(vedtak.fom);
  const vedtakAvsluttetDato = tilDatoMedManedNavn(vedtak.tom);
  const vedtakFattetDato = tilDatoMedManedNavn(vedtak.createdAt);

  return isNyVurderingStarted ? (
    <FattNyttVedtak />
  ) : (
    <div className="flex flex-col gap-4">
      <Box
        background="surface-default"
        padding="6"
        className="flex flex-col gap-4"
      >
        <Heading level="2" size="medium">
          {texts.heading}
        </Heading>
        <BodyLong>{texts.vedtakBleFattet(vedtakFattetDato)}</BodyLong>
        <BodyLong>
          {texts.forrigeVedtakInfo(
            hasVedtakStarted,
            hasVedtakEnded,
            vedtakStartDato,
            vedtakAvsluttetDato
          )}
        </BodyLong>
        <Button className="w-fit" onClick={() => setIsNyVurderingStarted(true)}>
          {texts.nyttVedtak}
        </Button>
      </Box>
    </div>
  );
}
