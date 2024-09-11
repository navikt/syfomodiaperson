import React from "react";
import { BodyShort, Box, Heading, HStack } from "@navikt/ds-react";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import { BellIcon } from "@navikt/aksel-icons";
import { useManglendeMedvirkningVurderingQuery } from "@/data/manglendemedvirkning/manglendeMedvirkningQueryHooks";
import { ManglendeMedvirkningButtons } from "@/sider/manglendemedvirkning/ManglendeMedvirkningButtons";

const texts = {
  title: "Fristen er gått ut",
  passertAlert: (sentDate: Date) =>
    `Fristen for forhåndsvarselet som ble sendt ut ${tilLesbarDatoMedArUtenManedNavn(
      sentDate
    )} er gått ut. Trykk på Innstilling om stans-knappen hvis vilkårene i § 8-8 ikke er oppfylt og rett til videre sykepenger skal stanses.`,
  ikkeAktuell:
    "Velg Ikke aktuell-knappen dersom personen har blitt friskmeldt etter at forhåndsvarselet ble sendt ut, eller av andre årsaker ikke er aktuell.",
  frist: "Fristen var: ",
  seSendtVarsel: "Se sendt varsel",
};

export default function ForhandsvarselAfterDeadline() {
  const { data } = useManglendeMedvirkningVurderingQuery();
  const forhandsvarsel = data[0];
  const frist = forhandsvarsel?.varsel?.svarfrist;

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
      <ManglendeMedvirkningButtons isBeforeForhandsvarselDeadline={false} />
    </Box>
  );
}
