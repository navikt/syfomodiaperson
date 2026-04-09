import React, { ReactElement } from "react";
import OppsummeringSporsmalstekst from "@/sider/sykepengsoknader/soknad-felles-oppsummering/OppsummeringSporsmalstekst";
import { BodyShort } from "@navikt/ds-react";
import { SporsmalDTO } from "@/data/sykepengesoknad/types/SykepengesoknadDTO";

export function OppsummeringFritekst({
  sporsmalstekst,
  id,
  svar,
}: SporsmalDTO): ReactElement {
  return (
    <div id={id}>
      <OppsummeringSporsmalstekst>{sporsmalstekst}</OppsummeringSporsmalstekst>
      {svar[0] && <BodyShort size="small">{svar[0].verdi}</BodyShort>}
    </div>
  );
}
