import React, { ReactElement } from "react";
import OppsummeringSporsmalscontainer from "./OppsummeringSporsmalscontainer";
import OppsummeringSporsmalstekst from "./OppsummeringSporsmalstekst";
import { getKey } from "./Oppsummeringsvisning";
import {
  SporsmalDTO,
  SvarDTO,
  SvarTypeDTO,
} from "@/data/sykepengesoknad/types/SykepengesoknadDTO";
import { BodyShort } from "@navikt/ds-react";

const texts = {
  timerTotalt: "timer totalt",
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

const getSvartypeText = (svartype: SvarTypeDTO | undefined): string => {
  switch (svartype) {
    case SvarTypeDTO.TIMER:
      return texts.timerTotalt;
    case SvarTypeDTO.PROSENT:
      return texts.prosent;
    default:
      return "";
  }
};

export default function OppsummeringTall({
  svar,
  sporsmalstekst,
  tag,
  svartype,
}: SporsmalDTO): ReactElement {
  const text = getSvartypeText(svartype);
  return (
    <OppsummeringSporsmalscontainer>
      <OppsummeringSporsmalstekst>{sporsmalstekst}</OppsummeringSporsmalstekst>
      {svar.map((svarverdi, index) => {
        const verdi = verdiAdjustedIfBelop(svarverdi, svartype);
        return (
          <BodyShort size="small" key={getKey(tag, index)}>
            {verdi} {text}
          </BodyShort>
        );
      })}
    </OppsummeringSporsmalscontainer>
  );
}
