import React from "react";
import { tilLesbarPeriodeMedArUtenManednavn } from "@/utils/datoUtils";
import BoksRad from "./BoksRad";
import { SykmeldingPeriodeDTO } from "@/data/sykmelding/types/SykmeldingOldFormat";

const kolonne2Tekst = (periode: SykmeldingPeriodeDTO) => {
  if (!!periode.behandlingsdager) {
    return periode.behandlingsdager === 1
      ? `${periode.behandlingsdager} behandlingsdag`
      : `${periode.behandlingsdager} behandlingsdager`;
  }
  if (!!periode.reisetilskudd) {
    return !!periode.grad
      ? `${periode.grad}% sykmeldt med reisetilskudd`
      : "Full jobb med reisetilskudd";
  }
  if (!!periode.avventende) {
    return "Avventende";
  }
  return periode.grad ? `${periode.grad}%` : "";
};

interface Props {
  perioder: SykmeldingPeriodeDTO[];
}

export function Perioder({ perioder }: Props) {
  return (
    <div className="sykmeldingMotebehovVisning__perioder">
      <h5 className="undertittel">Perioder</h5>
      {perioder.map((periode, index) => {
        return (
          <div key={index} className="sykmeldingMotebehovVisning__periodeBoks">
            <BoksRad
              kolonne1Tekst={`${tilLesbarPeriodeMedArUtenManednavn(
                periode.fom,
                periode.tom
              )}`}
              kolonne2Tekst={kolonne2Tekst(periode)}
              erTittel
            />
          </div>
        );
      })}
    </div>
  );
}
