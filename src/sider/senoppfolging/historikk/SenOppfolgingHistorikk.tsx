import { SenOppfolgingKandidatResponseDTO } from "@/data/senoppfolging/senOppfolgingTypes";
import { Accordion, BodyShort, Box, Heading, VStack } from "@navikt/ds-react";
import React from "react";
import { SenOppfolgingHistorikkItem } from "@/sider/senoppfolging/historikk/SenOppfolgingHistorikkItem";

const texts = {
  header: "Historikk",
  subHeader: "Tidligere oppfølging av snart slutt på sykepengene",
  noHistorikk:
    "Det finnes ingen tidligere oppfølging av snart slutt på sykepengene.",
};

interface Props {
  historikk: SenOppfolgingKandidatResponseDTO[];
}

export function SenOppfolgingHistorikk({ historikk }: Props) {
  const subheader = historikk.length > 0 ? texts.subHeader : texts.noHistorikk;

  return (
    <Box padding="6" background="surface-default">
      <VStack gap="8">
        <div>
          <Heading level="2" size="medium">
            {texts.header}
          </Heading>
          <BodyShort size="small">{subheader}</BodyShort>
        </div>
        <Accordion>
          {historikk.map((kandidat) => (
            <SenOppfolgingHistorikkItem
              key={kandidat.uuid}
              kandidat={kandidat}
            />
          ))}
        </Accordion>
      </VStack>
    </Box>
  );
}
