import { Box, Heading, HelpText } from "@navikt/ds-react";
import React from "react";
import { EksternLenke } from "@/components/EksternLenke";

const texts = {
  heading: "Øvingsside for Snart slutt på sykepengene",
  link: "Se nyeste versjon av svarskjemaet her",
  helpTextTitle: "Hvorfor kan øvingssiden avvike fra den sykmeldtes svar?",
  helpText: "Bruker kan ha svart på en tidligere versjon av svarskjemaet.",
};

const demoUrl =
  "https://demo.ekstern.dev.nav.no/syk/meroppfolging/snart-slutt-pa-sykepengene";

export default function OvingssideLink() {
  return (
    <Box
      background="surface-default"
      padding="6"
      className="flex flex-col gap-4 mb-2"
    >
      <div className="flex items-center gap-2">
        <Heading level="2" size="medium">
          {texts.heading}
        </Heading>
        <HelpText title={texts.helpTextTitle}>{texts.helpText}</HelpText>
      </div>
      <EksternLenke href={demoUrl}>{texts.link}</EksternLenke>
    </Box>
  );
}
