import React from "react";
import { BodyShort, Box, Heading } from "@navikt/ds-react";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import { getVarselSvarfrist } from "@/utils/senOppfolgingUtils";

const texts = {
  ikkeSvartHeading: "Den sykmeldte har ikke svart",
};

interface Props {
  varselAt: Date;
}

export function KandidatIkkeSvart({ varselAt }: Props) {
  const svarFrist = getVarselSvarfrist(varselAt);

  return (
    <Box
      background="surface-default"
      padding="6"
      className="flex flex-col gap-4"
    >
      <Heading size="medium">{texts.ikkeSvartHeading}</Heading>
      <BodyShort size="small">{`Den sykmeldte fikk varsel ${tilLesbarDatoMedArUtenManedNavn(
        varselAt
      )} om at det er snart slutt på sykepengene og kan svare på spørsmål rundt sin situasjon på innloggede sider.`}</BodyShort>
      <BodyShort size="small">{`Når spørsmålene er besvart eller om den sykmeldte ikke svarer innen ${tilLesbarDatoMedArUtenManedNavn(
        svarFrist
      )} vil du få en oppgave i oversikten om å vurdere videre oppfølging.`}</BodyShort>
    </Box>
  );
}
