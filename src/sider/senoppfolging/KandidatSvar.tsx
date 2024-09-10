import { SenOppfolgingFormResponseDTOV2 } from "@/data/senoppfolging/senOppfolgingTypes";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import { BodyShort, Box, Heading, Label } from "@navikt/ds-react";
import React from "react";

const texts = {
  heading: "Sykmeldtes svar",
};

interface KandidatSvarProps {
  svar: SenOppfolgingFormResponseDTOV2;
}

export function KandidatSvar({ svar }: KandidatSvarProps) {
  const svardato = svar && tilLesbarDatoMedArUtenManedNavn(svar.createdAt);
  return (
    <Box
      background="surface-default"
      padding="6"
      className="flex flex-col gap-4 mb-2"
    >
      <Heading size="medium">{texts.heading}</Heading>
      <BodyShort size="small">Den sykmeldte svarte {svardato}.</BodyShort>
      {svar &&
        svar?.questionResponses.map((response, index) => (
          <div key={index}>
            <Label size="small">{response.questionText}</Label>
            <BodyShort size="small">{response.answerText}</BodyShort>
          </div>
        ))}
    </Box>
  );
}
