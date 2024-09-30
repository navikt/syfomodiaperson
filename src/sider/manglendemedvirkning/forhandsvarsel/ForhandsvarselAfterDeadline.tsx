import React from "react";
import { BodyShort, Box, Heading, HStack } from "@navikt/ds-react";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import { BellIcon } from "@navikt/aksel-icons";
import { ManglendeMedvirkningButtons } from "@/sider/manglendemedvirkning/ManglendeMedvirkningButtons";
import { VurderingResponseDTO } from "@/data/manglendemedvirkning/manglendeMedvirkningTypes";
import SupportingTextList from "@/sider/manglendemedvirkning/forhandsvarsel/SupportingTextList";

const texts = {
  title: "Fristen er gått ut",
  frist: "Fristen var: ",
  seSendtVarsel: "Se sendt varsel",
};

interface Props {
  forhandsvarsel: VurderingResponseDTO;
}

export default function ForhandsvarselAfterDeadline({ forhandsvarsel }: Props) {
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
      <SupportingTextList isBeforeForhandsvarselDeadline={false} />
      <ManglendeMedvirkningButtons isBeforeForhandsvarselDeadline={false} />
    </Box>
  );
}
