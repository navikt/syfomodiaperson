import React from "react";
import { BodyShort, Box, Heading, HStack } from "@navikt/ds-react";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import { BellIcon } from "@navikt/aksel-icons";
import { ArbeidsuforhetButtons } from "@/sider/arbeidsuforhet/ArbeidsuforhetButtons";
import { VurderingResponseDTO } from "@/data/arbeidsuforhet/arbeidsuforhetTypes";

const texts = {
  title: "Fristen er gått ut",
  passertAlert: (sentDate: Date) =>
    `Fristen for forhåndsvarselet som ble sendt ut ${tilLesbarDatoMedArUtenManedNavn(
      sentDate
    )} er gått ut. Trykk på Innstilling om avslag-knappen hvis vilkårene i § 8-4 ikke er oppfylt og rett til videre sykepenger skal avslås.`,
  ikkeAktuell:
    "Velg Ikke aktuell-knappen hvis personen har blitt friskmeldt eller fått vedtak om § 8-5 Friskmelding til arbeidsformidling etter at forhåndsvarselet ble sendt ut.",
  frist: "Fristen var: ",
  seSendtVarsel: "Se sendt varsel",
};

interface Props {
  forhandsvarsel: VurderingResponseDTO;
}

export const ForhandsvarselAfterDeadline = ({ forhandsvarsel }: Props) => {
  const frist = forhandsvarsel.varsel?.svarfrist;

  return (
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
        <BellIcon title="bjelleikon" fontSize="2em" />
      </HStack>
      <BodyShort>{texts.passertAlert(forhandsvarsel.createdAt)}</BodyShort>
      <BodyShort>{texts.ikkeAktuell}</BodyShort>
      <ArbeidsuforhetButtons isBeforeForhandsvarselDeadline={false} />
    </Box>
  );
};
