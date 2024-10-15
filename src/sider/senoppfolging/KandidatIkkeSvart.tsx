import React from "react";
import { BodyShort, Box, Heading } from "@navikt/ds-react";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";

const texts = {
  ikkeSvartHeading: "Den sykmeldte har ikke svart",
};

interface Props {
  varselAt: Date;
}

export function KandidatIkkeSvart({ varselAt }: Props) {
  return (
    <Box
      background="surface-default"
      padding="6"
      className="flex flex-col gap-4"
    >
      <Heading size="medium">{texts.ikkeSvartHeading}</Heading>
      <BodyShort size="small">{`Den sykmeldte fikk varsel ${tilLesbarDatoMedArUtenManedNavn(
        varselAt
      )}`}</BodyShort>
    </Box>
  );
}
