import React from "react";
import { Alert, BodyShort, Box, Heading, HStack } from "@navikt/ds-react";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import { ClockIcon } from "@navikt/aksel-icons";
import { ManglendeMedvirkningButtons } from "@/sider/manglendemedvirkning/ManglendeMedvirkningButtons";
import { VurderingResponseDTO } from "@/data/manglendemedvirkning/manglendeMedvirkningTypes";

const texts = {
  title: "Venter på svar fra bruker",
  sentAlert: {
    isSent: (sentDate: Date) =>
      `Forhåndsvarselet er sendt ${tilLesbarDatoMedArUtenManedNavn(sentDate)}.`,
    oversikten:
      "Personen ligger nå i oversikten og kan finnes under filteret for § 8-8 manglende medvirkning.",
  },
  sendtInfo:
    "Dersom du har mottatt nye opplysninger og vurdert at bruker likevel oppfyller § 8-8, klikker du på Oppfylt-knappen.",
  ikkeAktuell:
    "Velg Ikke aktuell-knappen dersom personen har blitt friskmeldt etter at forhåndsvarselet ble sendt ut, eller av andre årsaker ikke er aktuell.",
  ikkeStans: "Du kan ikke stanse før fristen er gått ut.",
  frist: "Fristen går ut: ",
  seSendtVarsel: "Se sendt varsel",
};

interface Props {
  forhandsvarsel: VurderingResponseDTO;
}

export default function ForhandsvarselBeforeDeadline({
  forhandsvarsel,
}: Props) {
  const frist = forhandsvarsel.varsel?.svarfrist;

  return (
    <Box>
      <Alert variant="success" className="mb-2">
        <BodyShort className="mb-0">
          {texts.sentAlert.isSent(forhandsvarsel.createdAt)}
        </BodyShort>
        <BodyShort>{texts.sentAlert.oversikten}</BodyShort>
      </Alert>
      <Box
        background="surface-default"
        padding="6"
        className="flex flex-col gap-4"
      >
        <HStack align="center">
          <Heading level="2" size="medium">
            {texts.title}
          </Heading>
          <Box className="flex ml-auto mr-2 gap-1">
            <BodyShort weight="semibold">{texts.frist}</BodyShort>
            <BodyShort>{tilLesbarDatoMedArUtenManedNavn(frist)}</BodyShort>
          </Box>
          <ClockIcon title="klokkeikon" fontSize="2em" />
        </HStack>
        <BodyShort>{texts.sendtInfo}</BodyShort>
        <BodyShort>{texts.ikkeAktuell}</BodyShort>
        <BodyShort>{texts.ikkeStans}</BodyShort>
        <ManglendeMedvirkningButtons isBeforeForhandsvarselDeadline={true} />
      </Box>
    </Box>
  );
}
