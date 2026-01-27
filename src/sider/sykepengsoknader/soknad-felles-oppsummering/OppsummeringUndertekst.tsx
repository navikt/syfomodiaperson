import React, { ReactElement } from "react";
import OppsummeringSporsmalstekst from "./OppsummeringSporsmalstekst";
import OppsummeringUndersporsmalsliste from "./OppsummeringUndersporsmalsliste";
import { OppsummeringSporsmalProps } from "./OppsummeringSporsmal";

export function OppsummeringUndertekst({
  sporsmalstekst,
  id,
  overskriftsnivaa,
  undertekst,
  undersporsmal,
}: OppsummeringSporsmalProps): ReactElement {
  return (
    <div className="oppsummering__VisUndertekst" id={id}>
      <OppsummeringSporsmalstekst overskriftsnivaa={overskriftsnivaa}>
        {sporsmalstekst}
      </OppsummeringSporsmalstekst>
      {undertekst && <div className="redaksjonelt-innhold">{undertekst}</div>}
      {undersporsmal.length > 0 && (
        <OppsummeringUndersporsmalsliste
          sporsmalsliste={undersporsmal}
          overskriftsnivaa={overskriftsnivaa}
        />
      )}
    </div>
  );
}
