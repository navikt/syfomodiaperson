import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import {
  Alert,
  BodyShort,
  Box,
  Heading,
  Label,
  Loader,
} from "@navikt/ds-react";
import React from "react";
import { useSenOppfolgingSvarQuery } from "@/data/senoppfolging/useSenOppfolgingSvarQuery";
import { SvarResponseDTO } from "@/data/senoppfolging/senOppfolgingTypes";

const texts = {
  heading: "Sykmeldtes svar",
  formResponse: {
    pending: "Henter spørsmål og svar...",
    error:
      "Noe gikk galt ved henting av spørsmål og svar. Vennligst prøv igjen senere.",
  },
};

function KandidatFormResponse() {
  const { data, isPending, isError } = useSenOppfolgingSvarQuery();

  if (isPending) {
    return <Loader size="xlarge" title={texts.formResponse.pending} />;
  }
  if (isError || !data) {
    return (
      <Alert size="small" inline variant="error">
        {texts.formResponse.error}
      </Alert>
    );
  }

  return data.questionResponses.map((response, index) => (
    <div key={index}>
      <Label size="small">{response.questionText}</Label>
      <BodyShort size="small">{response.answerText}</BodyShort>
    </div>
  ));
}

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
