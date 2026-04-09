import React, { ReactElement } from "react";
import OppsummeringSporsmalstekst from "./OppsummeringSporsmalstekst";
import OppsummeringUndersporsmalsliste from "./OppsummeringUndersporsmalsliste";
import { SporsmalDTO } from "@/data/sykepengesoknad/types/SykepengesoknadDTO";
import { BodyShort } from "@navikt/ds-react";

export function OppsummeringUndertekst({
  sporsmalstekst,
  id,
  undertekst,
  undersporsmal,
}: SporsmalDTO): ReactElement {
  return (
    <div id={id}>
      <OppsummeringSporsmalstekst>{sporsmalstekst}</OppsummeringSporsmalstekst>
      {undertekst && <BodyShort size="small">{undertekst}</BodyShort>}
      {undersporsmal.length > 0 && (
        <OppsummeringUndersporsmalsliste sporsmalsliste={undersporsmal} />
      )}
    </div>
  );
}
