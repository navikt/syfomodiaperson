import React from "react";
import OppsummeringSporsmalscontainer from "./OppsummeringSporsmalscontainer";
import OppsummeringSporsmalstekst from "@/sider/sykepengsoknader/soknad-felles-oppsummering/OppsummeringSporsmalstekst";
import OppsummeringUndersporsmalsliste from "./OppsummeringUndersporsmalsliste";
import {
  SporsmalDTO,
  SvarTypeDTO,
  VisningskriterieDTO,
} from "@/data/sykepengesoknad/types/SykepengesoknadDTO";
import { Checkbox } from "@navikt/ds-react";

export default function OppsummeringRadiogruppe({
  sporsmalstekst,
  undersporsmal,
  id,
  svartype,
}: SporsmalDTO) {
  const besvartUndersporsmal = undersporsmal.find((s) => {
    return s.svar.length > 0 && s.svar[0].verdi === VisningskriterieDTO.CHECKED;
  });
  return (
    besvartUndersporsmal && (
      <OppsummeringSporsmalscontainer>
        <OppsummeringSporsmalstekst>
          {sporsmalstekst}
        </OppsummeringSporsmalstekst>
        {svartype === SvarTypeDTO.RADIO_GRUPPE && (
          <Checkbox size="small" id={id} readOnly checked>
            {besvartUndersporsmal.sporsmalstekst}
          </Checkbox>
        )}
        {besvartUndersporsmal.undersporsmal.length > 0 && (
          <OppsummeringUndersporsmalsliste
            sporsmalsliste={besvartUndersporsmal.undersporsmal}
          />
        )}
      </OppsummeringSporsmalscontainer>
    )
  );
}
