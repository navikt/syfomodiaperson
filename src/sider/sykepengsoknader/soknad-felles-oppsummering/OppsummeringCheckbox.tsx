import React, { ReactElement } from "react";
import OppsummeringUndersporsmalsliste from "./OppsummeringUndersporsmalsliste";
import {
  SporsmalDTO,
  VisningskriterieDTO,
} from "@/data/sykepengesoknad/types/SykepengesoknadDTO";
import { Checkbox } from "@navikt/ds-react";

export default function OppsummeringCheckbox({
  svar,
  sporsmalstekst,
  undersporsmal,
}: SporsmalDTO): ReactElement | null {
  return svar[0] && svar[0].verdi === VisningskriterieDTO.CHECKED ? (
    <div>
      <Checkbox size="small" readOnly checked>
        {sporsmalstekst}
      </Checkbox>
      {undersporsmal.length > 0 && (
        <OppsummeringUndersporsmalsliste sporsmalsliste={undersporsmal} />
      )}
    </div>
  ) : null;
}
