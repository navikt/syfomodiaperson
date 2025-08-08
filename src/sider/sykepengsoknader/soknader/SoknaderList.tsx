import React from "react";
import { SykepengesoknadDTO } from "@/data/sykepengesoknad/types/SykepengesoknadDTO";
import { Heading } from "@navikt/ds-react";
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
  return (
    <div className="mb-4">
      <Heading size="small" level="2">
        {tittel}
      </Heading>
      <div>
        {sykepengesoknader.length > 0 ? (
          sykepengesoknader.map((soknad, idx) => (
            <SykepengesoknadListItem key={idx} soknad={soknad} />
          ))
        ) : (
          <p className="panel typo-infotekst">{tomListeTekst}</p>
        )}
      </div>
    </div>
  );
}
