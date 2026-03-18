import React, { ReactElement } from "react";
import OppsummeringSporsmalscontainer from "./OppsummeringSporsmalscontainer";
import OppsummeringSporsmalstekst from "@/sider/sykepengsoknader/soknad-felles-oppsummering/OppsummeringSporsmalstekst";
import OppsummeringUndersporsmalsliste from "./OppsummeringUndersporsmalsliste";
import { OppsummeringSporsmalProps } from "./OppsummeringSporsmal";
import {
  SvarDTO,
  VisningskriterieDTO,
} from "@/data/sykepengesoknad/types/SykepengesoknadDTO";
import { Checkbox } from "@navikt/ds-react";

const texts = {
  ja: "Ja",
  nei: "Nei",
};

const getLedetekstFraSvar = (svar: string) => {
  return svar.toLowerCase() === "ja" ? texts.ja : texts.nei;
};

const erUndersporsmalStilt = (
  svar: SvarDTO[],
  kriterieForVisningAvUndersporsmal?: VisningskriterieDTO
) => svar.some((s) => s.verdi === kriterieForVisningAvUndersporsmal);

export function OppsummeringJaEllerNei({
  svar,
  sporsmalstekst,
  tag,
  overskriftsnivaa = 3,
  kriterieForVisningAvUndersporsmal,
  undersporsmal,
}: OppsummeringSporsmalProps): ReactElement | null {
  if (svar[0] === undefined) {
    return null;
  }
  return (
    <OppsummeringSporsmalscontainer tag={tag}>
      <OppsummeringSporsmalstekst overskriftsnivaa={overskriftsnivaa}>
        {sporsmalstekst}
      </OppsummeringSporsmalstekst>
      <Checkbox size="small" readOnly checked>
        {getLedetekstFraSvar(svar[0].verdi as string)}
      </Checkbox>
      {erUndersporsmalStilt(svar, kriterieForVisningAvUndersporsmal) &&
        undersporsmal.length > 0 && (
          <OppsummeringUndersporsmalsliste
            sporsmalsliste={undersporsmal}
            overskriftsnivaa={overskriftsnivaa + 1}
          />
        )}
    </OppsummeringSporsmalscontainer>
  );
}
