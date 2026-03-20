import React, { ReactElement } from "react";
import OppsummeringUndersporsmalsliste from "./OppsummeringUndersporsmalsliste";
import { OppsummeringSporsmalProps } from "./OppsummeringSporsmal";
import { VisningskriterieDTO } from "@/data/sykepengesoknad/types/SykepengesoknadDTO";
import { Checkbox } from "@navikt/ds-react";

export default function OppsummeringCheckbox({
  svar,
  sporsmalstekst,
  undersporsmal,
  overskriftsnivaa = 3,
}: OppsummeringSporsmalProps): ReactElement | null {
  return svar[0] && svar[0].verdi === VisningskriterieDTO.CHECKED ? (
    <div>
      <Checkbox size="small" readOnly checked>
        {sporsmalstekst}
      </Checkbox>
      {undersporsmal.length > 0 && (
        <OppsummeringUndersporsmalsliste
          sporsmalsliste={undersporsmal}
          overskriftsnivaa={overskriftsnivaa}
        />
      )}
    </div>
  ) : null;
}
