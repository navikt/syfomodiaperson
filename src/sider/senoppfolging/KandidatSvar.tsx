import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import { BodyShort, Box, Heading } from "@navikt/ds-react";
import React from "react";
import { SvarResponseDTO } from "@/data/senoppfolging/senOppfolgingTypes";
import { KandidatFormResponse } from "@/sider/senoppfolging/KandidatFormResponse";

const texts = {
  heading: "Sykmeldtes svar",
};

interface KandidatSvarProps {
  svar: SvarResponseDTO;
}

export function KandidatSvar({ svar }: KandidatSvarProps) {
  const svardato = svar && tilLesbarDatoMedArUtenManedNavn(svar.svarAt);

  return (
    <Box
      background="surface-default"
      padding="6"
      className="flex flex-col gap-4 mb-2"
    >
      <Heading size="medium">{texts.heading}</Heading>
      <BodyShort size="small">Den sykmeldte svarte {svardato}.</BodyShort>
      <KandidatFormResponse />
    </Box>
  );
}
