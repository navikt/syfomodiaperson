import React from "react";
import { BodyLong, BodyShort, Box, Heading, HStack } from "@navikt/ds-react";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import { ClockIcon } from "@navikt/aksel-icons";
import { ArbeidsuforhetButtons } from "@/sider/arbeidsuforhet/ArbeidsuforhetButtons";
import { VurderingResponseDTO } from "@/sider/arbeidsuforhet/data/arbeidsuforhetTypes";

const texts = {
  title: "Venter på svar fra bruker",
  sendtInfo:
    "Dersom du har mottatt nye opplysninger og vurdert at bruker likevel oppfyller § 8-4, klikker du på Oppfylt-knappen.",
  avslag: "Du kan ikke avslå før fristen er gått ut.",
  ikkeAktuell:
    "Velg Ikke aktuell-knappen hvis personen har blitt friskmeldt eller fått vedtak om § 8-5 Friskmelding til arbeidsformidling etter at forhåndsvarselet ble sendt ut.",
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
      <BodyLong>{texts.sendtInfo}</BodyLong>
      <BodyShort>{texts.ikkeAktuell}</BodyShort>
      <BodyShort>{texts.avslag}</BodyShort>
      <ArbeidsuforhetButtons isBeforeForhandsvarselDeadline={true} />
    </Box>
  );
}
