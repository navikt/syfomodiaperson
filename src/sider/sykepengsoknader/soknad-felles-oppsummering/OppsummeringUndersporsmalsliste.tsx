import React, { ReactElement } from "react";
import OppsummeringSporsmal from "./OppsummeringSporsmal";
import { getKey } from "./Oppsummeringsvisning";
import { SporsmalDTO } from "@/data/sykepengesoknad/types/SykepengesoknadDTO";

interface OppsummeringUndersporsmalslisteProps {
  sporsmalsliste: SporsmalDTO[];
}

export default function OppsummeringUndersporsmalsliste({
  sporsmalsliste,
}: OppsummeringUndersporsmalslisteProps): ReactElement {
  return (
    <div className="ml-6">
      {sporsmalsliste.map((sporsmal) => (
        <OppsummeringSporsmal
          {...sporsmal}
          key={getKey(sporsmal.tag, sporsmal.id)}
        />
      ))}
    </div>
  );
}
