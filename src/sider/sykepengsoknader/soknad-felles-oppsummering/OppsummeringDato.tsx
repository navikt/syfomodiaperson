import { ReactElement } from "react";
import { formatShortDateOrUndefined } from "@/utils/datoUtils";
import { getKey } from "./Oppsummeringsvisning";
import OppsummeringSporsmalscontainer from "./OppsummeringSporsmalscontainer";
import OppsummeringSporsmalstekst from "./OppsummeringSporsmalstekst";
import { BodyShort } from "@navikt/ds-react";
import { SporsmalDTO } from "@/data/sykepengesoknad/types/SykepengesoknadDTO";

export default function OppsummeringDato({
  tag,
  sporsmalstekst,
  svar,
}: SporsmalDTO): ReactElement {
  return (
    <OppsummeringSporsmalscontainer>
      <OppsummeringSporsmalstekst>{sporsmalstekst}</OppsummeringSporsmalstekst>
      {svar.map((svarverdi, index) => {
        return (
          <BodyShort size="small" key={getKey(tag, index)}>
            {formatShortDateOrUndefined(svarverdi.verdi)}
          </BodyShort>
        );
      })}
    </OppsummeringSporsmalscontainer>
  );
}
