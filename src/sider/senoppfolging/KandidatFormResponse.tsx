import { useSenOppfolgingSvarQuery } from "@/data/senoppfolging/useSenOppfolgingSvarQuery";
import { Alert, BodyShort, Label, Loader } from "@navikt/ds-react";
import React from "react";

const texts = {
  pending: "Henter spørsmål og svar...",
  error:
    "Noe gikk galt ved henting av spørsmål og svar. Vennligst prøv igjen senere.",
};

export function KandidatFormResponse() {
  const { data, isPending, isError } = useSenOppfolgingSvarQuery();

  if (isPending) {
    return <Loader size="xlarge" title={texts.pending} />;
  }
  if (isError || !data) {
    return (
      <Alert size="small" inline variant="error">
        {texts.error}
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
