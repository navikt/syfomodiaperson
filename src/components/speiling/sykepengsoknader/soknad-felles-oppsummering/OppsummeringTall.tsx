import React, { ReactElement } from "react";
import OppsummeringSporsmalscontainer from "./OppsummeringSporsmalscontainer";
import OppsummeringSporsmalstekst from "./OppsummeringSporsmalstekst";
import { getKey } from "./Oppsummeringsvisning";
import { OppsummeringSporsmalProps } from "./OppsummeringSporsmal";
import {
  SvarDTO,
  SvarTypeDTO,
} from "@/data/sykepengesoknad/types/SykepengesoknadDTO";

const texts = {
  timerTot: "timer totalt",
  prosent: "prosent",
};

const verdiAdjustedIfBelop = (
  svar: SvarDTO,
  svartype?: SvarTypeDTO
): string => {
  if (svartype == SvarTypeDTO.BELOP) {
    return (Number(svar.verdi) / 100).toString();
  }
  return svar.verdi as string;
};

const OppsummeringTall = ({
  svar,
  sporsmalstekst,
  tag,
  overskriftsnivaa,
  svartype,
  undertekst,
}: OppsummeringSporsmalProps): ReactElement => {
  const text = svartype === SvarTypeDTO.TIMER ? texts.timerTot : texts.prosent;
  const label = undertekst || text;
  return (
    <OppsummeringSporsmalscontainer tag={tag}>
      <OppsummeringSporsmalstekst overskriftsnivaa={overskriftsnivaa}>
        {sporsmalstekst}
      </OppsummeringSporsmalstekst>
      <div className="oppsummering__tekstsvar">
        {svar.map((svarverdi, index) => {
          const verdi = verdiAdjustedIfBelop(svarverdi, svartype);
          return (
            <p className="oppsummering__tekst" key={getKey(tag, index)}>
              {verdi} {label}
            </p>
          );
        })}
      </div>
    </OppsummeringSporsmalscontainer>
  );
};

export default OppsummeringTall;
