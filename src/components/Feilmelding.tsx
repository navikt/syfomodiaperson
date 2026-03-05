import React from "react";
import { BodyShort, Box, Heading } from "@navikt/ds-react";

interface Props {
  tittel?: string;
  melding?: string;
}

export default function Feilmelding({
  tittel = "Beklager, det oppstod en feil",
  melding = "Vennligst prøv igjen litt senere.",
}: Props) {
  return (
    <Box background="default" className="text-center" padding="space-24">
      <Heading size="medium" level="3" className="mt-8">
        {tittel}
      </Heading>
      <BodyShort size="small">{melding}</BodyShort>
    </Box>
  );
}
