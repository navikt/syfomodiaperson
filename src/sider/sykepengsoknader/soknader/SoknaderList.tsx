import React from "react";
import { SykepengesoknadDTO } from "@/data/sykepengesoknad/types/SykepengesoknadDTO";
import { BodyShort, Box, Heading } from "@navikt/ds-react";
import SykepengesoknadListItem from "@/sider/sykepengsoknader/soknader/SykepengesoknadListItem";

interface Props {
  sykepengesoknader: SykepengesoknadDTO[];
  tomListeTekst: string;
  tittel: string;
}

export default function SoknaderList({
  sykepengesoknader,
  tittel,
  tomListeTekst,
}: Props) {
  const hasSykepengersoknad = !!sykepengesoknader.length;
  return (
    <div className="mb-4">
      <Box background="surface-default" padding="4">
        <Heading size="small" level="2">
          {tittel}
        </Heading>
        {!hasSykepengersoknad && (
          <BodyShort size="small" className="flex-1 mt-3">
            {tomListeTekst}
          </BodyShort>
        )}
      </Box>
      {hasSykepengersoknad &&
        sykepengesoknader.map((soknad, idx) => (
          <SykepengesoknadListItem key={idx} soknad={soknad} />
        ))}
    </div>
  );
}
