import React from "react";
import { TIMER } from "../../enums/svartyper";
import OppsummeringSporsmalscontainer from "./OppsummeringSporsmalscontainer";
import OppsummeringSporsmalstekst from "./OppsummeringSporsmalstekst";
import { oppsummeringSporsmal } from "../../propTypes";
import { getKey } from "./Oppsummeringsvisning";

const texts = {
  timerTot: "timer totalt",
  prosent: "prosent",
};

const OppsummeringTall = ({
  svar,
  sporsmalstekst,
  tag,
  overskriftsnivaa,
  svartype,
  undertekst,
}) => {
  const text = svartype === TIMER ? texts.timerTot : texts.prosent;
  const label = undertekst || text;
  return (
    <OppsummeringSporsmalscontainer tag={tag}>
      <OppsummeringSporsmalstekst overskriftsnivaa={overskriftsnivaa}>
        {sporsmalstekst}
      </OppsummeringSporsmalstekst>
      <div className="oppsummering__tekstsvar">
        {svar.map((svarverdi, index) => {
          return (
            <p className="oppsummering__tekst" key={getKey(tag, index)}>
              {svarverdi.verdi} {label}
            </p>
          );
        })}
      </div>
    </OppsummeringSporsmalscontainer>
  );
};

OppsummeringTall.propTypes = oppsummeringSporsmal;

export default OppsummeringTall;
