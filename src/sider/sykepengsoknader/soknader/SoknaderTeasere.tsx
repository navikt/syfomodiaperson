import React from "react";
import SoknadTeaser from "./SoknadTeaser";
import { SykepengesoknadDTO } from "@/data/sykepengesoknad/types/SykepengesoknadDTO";
import { Heading } from "@navikt/ds-react";

interface Props {
  sykepengesoknader: SykepengesoknadDTO[];
  tomListeTekst: string;
  tittel: string;
}

export default function SoknaderTeasere({
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
            <SoknadTeaser key={idx} soknad={soknad} />
          ))
        ) : (
          <p className="panel typo-infotekst">{tomListeTekst}</p>
        )}
      </div>
    </div>
  );
}
