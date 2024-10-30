import React from "react";
import { BodyShort, Box, Heading } from "@navikt/ds-react";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import {
  getVarselSvarfrist,
  isVarselSvarfristUtlopt,
} from "@/utils/senOppfolgingUtils";

const texts = {
  heading: "Den sykmeldte har ikke svart",
};

interface Props {
  varselAt: Date;
}

function getOppgaveText(varselAt: Date): string {
  if (isVarselSvarfristUtlopt(varselAt)) {
    return "Den sykmeldte har fått en påminnelse om å svare og fortsatt ikke svart. Du kan nå gjøre en vurdering om den sykmeldte trenger oppfølging fra Nav i sen fase av sykefraværet. Hvis den sykmeldte svarer på et senere tidspunkt vil du få en ny oppgave.";
  } else {
    return `Når spørsmålene er besvart eller hvis den sykmeldte ikke svarer innen ${tilLesbarDatoMedArUtenManedNavn(
      getVarselSvarfrist(varselAt)
    )}, vil du få en oppgave i oversikten om å vurdere videre oppfølging.`;
  }
}

export function KandidatIkkeSvart({ varselAt }: Props) {
  return (
    <Box
      background="surface-default"
      padding="6"
      className="flex flex-col gap-4 mb-2"
    >
      <Heading size="medium">{texts.heading}</Heading>
      <BodyShort size="small">{`Den sykmeldte fikk varsel ${tilLesbarDatoMedArUtenManedNavn(
        varselAt
      )} om at det er snart slutt på sykepengene og kan nå svare på spørsmål rundt sin situasjon på innloggede sider.`}</BodyShort>
      <BodyShort size="small">{getOppgaveText(varselAt)}</BodyShort>
    </Box>
  );
}
