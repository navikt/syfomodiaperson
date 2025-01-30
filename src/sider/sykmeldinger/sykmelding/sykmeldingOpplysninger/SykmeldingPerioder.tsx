import React from "react";
import SykmeldingPeriode from "./SykmeldingPeriode";
import { SykmeldingPeriodeDTO } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { getDuration, toDate } from "@/utils/datoUtils";

interface Props {
  perioder: SykmeldingPeriodeDTO[];
}

function sorterPerioderEldsteForst(
  perioder: SykmeldingPeriodeDTO[]
): SykmeldingPeriodeDTO[] {
  return perioder.sort((a, b) => {
    if (toDate(a.fom)?.getTime() !== toDate(b.fom)?.getTime()) {
      return (toDate(a.fom)?.getTime() ?? 0) - (toDate(b.fom)?.getTime() ?? 0);
    }
    return (toDate(a.tom)?.getTime() ?? 0) - (toDate(b.tom)?.getTime() ?? 0);
  });
}

export default function SykmeldingPerioder(sykmeldingPerioderProps: Props) {
  const { perioder = [] } = sykmeldingPerioderProps;
  return (
    <div className={`${perioder.length > 1 && "margin-bottom: 1rem;"}`}>
      {sorterPerioderEldsteForst(perioder).map((periode, index) => {
        return (
          <SykmeldingPeriode
            key={index}
            periode={periode}
            antallDager={getDuration(periode.fom, periode.tom)}
          />
        );
      })}
    </div>
  );
}
