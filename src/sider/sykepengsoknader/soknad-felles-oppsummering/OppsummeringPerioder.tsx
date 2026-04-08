import React, { ReactElement } from "react";
import { getKey } from "./Oppsummeringsvisning";
import { toDatePrettyPrint } from "@/utils/datoUtils";
import OppsummeringSporsmalscontainer from "./OppsummeringSporsmalscontainer";
import OppsummeringSporsmalstekst from "@/sider/sykepengsoknader/soknad-felles-oppsummering/OppsummeringSporsmalstekst";
import { SporsmalDTO } from "@/data/sykepengesoknad/types/SykepengesoknadDTO";

const textFomTom = (fom?: string, tom?: string) => {
  return `Fra ${fom} til ${tom}`;
};

export default function OppsummeringPerioder({
  svar,
  sporsmalstekst,
  tag,
}: SporsmalDTO): ReactElement {
  return (
    <OppsummeringSporsmalscontainer>
      <OppsummeringSporsmalstekst>{sporsmalstekst}</OppsummeringSporsmalstekst>
      <div className="oppsummering__tekstsvar">
        {svar.map((p, i) => {
          const periode = JSON.parse(p.verdi.toString());
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
}
