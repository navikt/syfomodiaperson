import React, { ReactElement } from "react";
import OppsummeringSporsmalstekst from "./OppsummeringSporsmalstekst";
import OppsummeringUndersporsmalsliste from "./OppsummeringUndersporsmalsliste";
import { SporsmalDTO } from "@/data/sykepengesoknad/types/SykepengesoknadDTO";

export function OppsummeringUndertekst({
  sporsmalstekst,
  id,
  undertekst,
  undersporsmal,
}: SporsmalDTO): ReactElement {
  return (
    <div className="oppsummering__VisUndertekst" id={id}>
      <OppsummeringSporsmalstekst>{sporsmalstekst}</OppsummeringSporsmalstekst>
      {undertekst && <div className="redaksjonelt-innhold">{undertekst}</div>}
      {undersporsmal.length > 0 && (
        <OppsummeringUndersporsmalsliste sporsmalsliste={undersporsmal} />
      )}
    </div>
  );
}
