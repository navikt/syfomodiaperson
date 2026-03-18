import React, { ReactElement } from "react";
import { toDatePrettyPrint } from "@/utils/datoUtils";
import { getKey } from "./Oppsummeringsvisning";
import OppsummeringSporsmalscontainer from "./OppsummeringSporsmalscontainer";
import OppsummeringSporsmalstekst from "./OppsummeringSporsmalstekst";
import { OppsummeringSporsmalProps } from "./OppsummeringSporsmal";
import { BodyShort } from "@navikt/ds-react";

export default function OppsummeringDato({
  tag,
  sporsmalstekst,
  svar,
  overskriftsnivaa = 3,
}: OppsummeringSporsmalProps): ReactElement {
  return (
    <OppsummeringSporsmalscontainer tag={tag}>
      <OppsummeringSporsmalstekst overskriftsnivaa={overskriftsnivaa}>
        {sporsmalstekst}
      </OppsummeringSporsmalstekst>
      {svar.map((svarverdi, index) => {
        return (
          <BodyShort size="small" key={getKey(tag, index)}>
            {toDatePrettyPrint(svarverdi.verdi)}
          </BodyShort>
        );
      })}
    </OppsummeringSporsmalscontainer>
  );
}
