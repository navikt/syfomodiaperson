import { BodyShort, Box } from "@navikt/ds-react";
import React from "react";

const texts = {
  info1:
    "Den sykmeldte har ikke mottatt varsel om at det snart er slutt på sykepengene enda.",
  info2:
    "Når den sykmeldte har 90 dager eller mindre igjen av sykepengene, vil han eller hun få et varsel om å svare på spørsmål rundt sin situasjon på innloggede sider.",
  info3:
    "Når spørsmålene er besvart, vil du få en oppgave i oversikten din om å vurdere videre oppfølging. Svarene fra den sykmeldte dukker opp på denne siden.",
};

export default function IkkeKandidatInfo() {
  return (
    <Box
      background="surface-default"
      padding="6"
      className="flex flex-col gap-4"
    >
      <BodyShort size="small">{texts.info1}</BodyShort>
      <BodyShort size="small">{texts.info2}</BodyShort>
      <BodyShort size="small">{texts.info3}</BodyShort>
    </Box>
  );
}
