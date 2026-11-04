import { useSenOppfolgingSvarQuery } from "@/data/senoppfolging/useSenOppfolgingSvarQuery";
import { LocalAlert, BodyShort, Label, Loader } from "@navikt/ds-react";

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
      <LocalAlert size="small" status="error">
        <LocalAlert.Header>
          <LocalAlert.Title>{texts.error}</LocalAlert.Title>
        </LocalAlert.Header>
      </LocalAlert>
    );
  }

  return data.questionResponses.map((response, index) => (
    <div key={index}>
      <Label size="small">{response.questionText}</Label>
      <BodyShort size="small">{response.answerText}</BodyShort>
    </div>
  ));
}
