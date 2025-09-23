import React, { ReactElement, useState } from "react";
import {
  SykmeldingOldFormat,
  SykmeldingStatus,
} from "@/data/sykmelding/types/SykmeldingOldFormat";
import Sykmeldinger from "./Sykmeldinger";
import { VelgSykmeldingSorteringDropdown } from "./VelgSykmeldingSorteringDropdown";
import {
  SorteringKriterium,
  SorteringsKriteriumVerdi,
  sorterSykmeldinger,
} from "@/utils/sorterSykmeldingerUtils";
import { manederMellomDatoer } from "@/utils/datoUtils";
import { senesteTom } from "@/utils/periodeUtils";

const texts = {
  tidligereSykmeldinger: "Tidligere sykmeldinger",
  ingenNyeSykmeldinger: "Du har ingen nye sykmeldinger",
  ingenTidligereSykmeldinger: "Du har ingen tidligere sykmeldinger",
  nyeSykmeldinger: "Nye sykmeldinger",
  apneSykmelding: "Åpne sykmelding",
  sorteringDato: "Dato",
  sorteringArbeidsgiver: "Arbeidsgiver",
};

const sorteringsKriterier: SorteringKriterium[] = [
  {
    tekst: texts.sorteringDato,
    verdi: "dato",
  },
  {
    tekst: texts.sorteringArbeidsgiver,
    verdi: "arbeidsgiver",
  },
];

const isAktivSykmelding = (sykmld: SykmeldingOldFormat) =>
  sykmld.status === SykmeldingStatus.NY &&
  manederMellomDatoer(
    senesteTom(sykmld.mulighetForArbeid.perioder),
    new Date()
  ) < 3;

const isTidligereSykmelding = (sykmld: SykmeldingOldFormat) =>
  sykmld.status !== SykmeldingStatus.NY ||
  manederMellomDatoer(
    senesteTom(sykmld.mulighetForArbeid.perioder),
    new Date()
  ) >= 3;

interface Props {
  sykmeldinger: SykmeldingOldFormat[];
}

export default function DineSykmeldinger({
  sykmeldinger,
}: Props): ReactElement {
  const nyeSykmeldinger = sykmeldinger.filter((sykmld) => {
    return isAktivSykmelding(sykmld);
  });
  const tidligereSykmeldinger = sykmeldinger.filter((sykmld) => {
    return isTidligereSykmelding(sykmld);
  });
  const [valgtSortering, setValgtSortering] =
    useState<SorteringsKriteriumVerdi>("dato");

  return (
    <>
      <Sykmeldinger
        sykmeldinger={sorterSykmeldinger(nyeSykmeldinger)}
        tittel={texts.nyeSykmeldinger}
        ingenSykmeldingerMelding={texts.ingenNyeSykmeldinger}
      />
      {tidligereSykmeldinger.length > 0 && (
        <Sykmeldinger
          sykmeldinger={sorterSykmeldinger(
            tidligereSykmeldinger,
            valgtSortering
          )}
          tittel={texts.tidligereSykmeldinger}
          ingenSykmeldingerMelding={texts.ingenTidligereSykmeldinger}
        >
          <VelgSykmeldingSorteringDropdown
            sorteringsKriterier={sorteringsKriterier}
            onSorteringChanged={(e) => setValgtSortering(e.target.value)}
          />
        </Sykmeldinger>
      )}
    </>
  );
}
