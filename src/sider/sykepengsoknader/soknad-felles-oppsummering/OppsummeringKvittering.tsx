import React from "react";
import { OppsummeringSporsmalProps } from "@/sider/sykepengsoknader/soknad-felles-oppsummering/OppsummeringSporsmal";
import OppsummeringSporsmalstekst from "@/sider/sykepengsoknader/soknad-felles-oppsummering/OppsummeringSporsmalstekst";
import {
  Kvittering,
  SvarDTO,
} from "@/data/sykepengesoknad/types/SykepengesoknadDTO";
import OppsummeringSporsmalscontainer from "@/sider/sykepengsoknader/soknad-felles-oppsummering/OppsummeringSporsmalscontainer";
import { Checkbox } from "@navikt/ds-react";

const texts = {
  opplastingTom: "Du har ikke lastet opp noen utgifter",
};

const oneKvitteringText = (sum: number): string => {
  return `Du lastet opp 1 utgift på ${sum} kr`;
};

const moreKvitteringText = (antall: number, sum: number): string => {
  return `Du lastet opp ${antall} utgifter på til sammen ${sum} kr`;
};

const sumOfKvitteringer = (svar: SvarDTO[]): number => {
  const total = svar.reduce((previous: number, currentSvar: SvarDTO) => {
    const currentKvittering: Kvittering = JSON.parse(
      currentSvar.verdi as string
    );
    return previous + currentKvittering.belop;
  }, 0);

  return total / 100;
};

export default function OppsummeringKvittering({
  sporsmalstekst,
  tag,
  overskriftsnivaa,
  svar,
}: OppsummeringSporsmalProps) {
  const antall = svar.length;
  const sum = sumOfKvitteringer(svar);

  let svartekst: string;
  if (svar.length === 0) {
    svartekst = texts.opplastingTom;
  } else if (svar.length === 1) {
    svartekst = oneKvitteringText(sum);
  } else {
    svartekst = moreKvitteringText(antall, sum);
  }

  return (
    <OppsummeringSporsmalscontainer tag={tag}>
      <OppsummeringSporsmalstekst overskriftsnivaa={overskriftsnivaa}>
        {sporsmalstekst}
      </OppsummeringSporsmalstekst>
      <Checkbox size="small" readOnly checked>
        {svartekst}
      </Checkbox>
    </OppsummeringSporsmalscontainer>
  );
}
