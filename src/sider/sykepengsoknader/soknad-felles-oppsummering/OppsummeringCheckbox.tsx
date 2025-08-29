import React, { ReactElement } from "react";
import OppsummeringUndersporsmalsliste from "./OppsummeringUndersporsmalsliste";
import { OppsummeringSporsmalProps } from "./OppsummeringSporsmal";
import { VisningskriterieDTO } from "@/data/sykepengesoknad/types/SykepengesoknadDTO";
import { CheckboxPng } from "../../../../img/ImageComponents";

export default function OppsummeringCheckbox({
  svar,
  sporsmalstekst,
  undersporsmal,
  overskriftsnivaa = 3,
}: OppsummeringSporsmalProps): ReactElement | null {
  return svar[0] && svar[0].verdi === VisningskriterieDTO.CHECKED ? (
    <div>
      <div className="oppsummering__avkrysset">
        <img src={CheckboxPng} alt="Avkrysset" />
        <span>{sporsmalstekst}</span>
      </div>
      {undersporsmal.length > 0 && (
        <OppsummeringUndersporsmalsliste
          sporsmalsliste={undersporsmal}
          overskriftsnivaa={overskriftsnivaa}
        />
      )}
    </div>
  ) : null;
}
