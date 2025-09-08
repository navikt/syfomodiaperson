import React, { ReactElement } from "react";
import OppsummeringSporsmal from "./OppsummeringSporsmal";
import { getKey } from "./Oppsummeringsvisning";
import { SporsmalDTO } from "@/data/sykepengesoknad/types/SykepengesoknadDTO";

interface OppsummeringUndersporsmalslisteProps {
  sporsmalsliste: SporsmalDTO[];
  overskriftsnivaa?: number;
}

export default function OppsummeringUndersporsmalsliste({
  sporsmalsliste,
  overskriftsnivaa = 4,
}: OppsummeringUndersporsmalslisteProps): ReactElement {
  return (
    <div className="oppsummering__undersporsmalsliste">
      {sporsmalsliste.map((sporsmal) => (
        <OppsummeringSporsmal
          {...sporsmal}
          key={getKey(sporsmal.tag, sporsmal.id)}
          overskriftsnivaa={overskriftsnivaa}
        />
      ))}
    </div>
  );
}
