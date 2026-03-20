import React, { ReactElement } from "react";
import { toDatePrettyPrint } from "@/utils/datoUtils";
import OppsummeringSporsmalscontainer from "./OppsummeringSporsmalscontainer";
import OppsummeringSporsmalstekst from "@/sider/sykepengsoknader/soknad-felles-oppsummering/OppsummeringSporsmalstekst";
import { OppsummeringSporsmalProps } from "./OppsummeringSporsmal";
import { Checkbox } from "@navikt/ds-react";

export function OppsummeringGruppeRadioUkekalender({
  svar,
  sporsmalstekst,
  overskriftsnivaa,
  id,
}: OppsummeringSporsmalProps): ReactElement {
  const oppsummertSvar =
    svar[0] && svar[0].verdi !== "Ikke til behandling"
      ? toDatePrettyPrint(svar[0].verdi)
      : "Ikke til behandling";
  return (
    <OppsummeringSporsmalscontainer>
      <OppsummeringSporsmalstekst overskriftsnivaa={overskriftsnivaa}>
        {sporsmalstekst}
      </OppsummeringSporsmalstekst>
      <Checkbox size="small" id={id} readOnly checked>
        {oppsummertSvar}
      </Checkbox>
    </OppsummeringSporsmalscontainer>
  );
}
