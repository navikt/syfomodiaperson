import React, { ReactElement } from "react";
import { toDatePrettyPrint } from "@/utils/datoUtils";
import OppsummeringSporsmalscontainer from "./OppsummeringSporsmalscontainer";
import OppsummeringSporsmalstekst from "@/sider/sykepengsoknader/soknad-felles-oppsummering/OppsummeringSporsmalstekst";
import { Checkbox } from "@navikt/ds-react";
import { SporsmalDTO } from "@/data/sykepengesoknad/types/SykepengesoknadDTO";

export function OppsummeringGruppeRadioUkekalender({
  svar,
  sporsmalstekst,
  id,
}: SporsmalDTO): ReactElement {
  const oppsummertSvar =
    svar[0] && svar[0].verdi !== "Ikke til behandling"
      ? toDatePrettyPrint(svar[0].verdi)
      : "Ikke til behandling";
  return (
    <OppsummeringSporsmalscontainer>
      <OppsummeringSporsmalstekst>{sporsmalstekst}</OppsummeringSporsmalstekst>
      <Checkbox size="small" id={id} readOnly checked>
        {oppsummertSvar}
      </Checkbox>
    </OppsummeringSporsmalscontainer>
  );
}
