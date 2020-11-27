import React from "react";
import { toDatePrettyPrint } from "@navikt/digisyfo-npm";
import { getKey } from "./Oppsummeringsvisning";
import OppsummeringSporsmalscontainer from "./OppsummeringSporsmalscontainer";
import OppsummeringSporsmalstekst from "./OppsummeringSporsmalstekst";
import { oppsummeringSporsmal } from "../../propTypes";

const textFomTom = (fom, tom) => {
  return `Fra ${fom} til ${tom}`;
};

const OppsummeringPerioder = ({
  svar,
  sporsmalstekst,
  tag,
  overskriftsnivaa,
}) => {
  return (
    <OppsummeringSporsmalscontainer tag={tag}>
      <OppsummeringSporsmalstekst overskriftsnivaa={overskriftsnivaa}>
        {sporsmalstekst}
      </OppsummeringSporsmalstekst>
      <div className="oppsummering__tekstsvar">
        {svar.map((p, i) => {
          const periode = JSON.parse(p.verdi);
          return (
            <p key={getKey(tag, i)} className="oppsummering__dato">
              {textFomTom(
                toDatePrettyPrint(periode.fom),
                toDatePrettyPrint(periode.tom)
              )}
            </p>
          );
        })}
      </div>
    </OppsummeringSporsmalscontainer>
  );
};

OppsummeringPerioder.propTypes = oppsummeringSporsmal;

export default OppsummeringPerioder;
