import React, { ReactElement } from "react";
import OppsummeringSporsmalstekst from "@/sider/sykepengsoknader/soknad-felles-oppsummering/OppsummeringSporsmalstekst";
import { OppsummeringSporsmalProps } from "./OppsummeringSporsmal";
import { BodyShort } from "@navikt/ds-react";

export function OppsummeringFritekst({
  sporsmalstekst,
  id,
  overskriftsnivaa,
  svar,
}: OppsummeringSporsmalProps): ReactElement {
  return (
    <div id={id}>
      <OppsummeringSporsmalstekst overskriftsnivaa={overskriftsnivaa}>
        {sporsmalstekst}
      </OppsummeringSporsmalstekst>
      {svar[0] && <BodyShort size="small">{svar[0].verdi}</BodyShort>}
    </div>
  );
}
