import React from "react";
import { tilLesbarPeriodeMedArUtenManednavn } from "@/utils/datoUtils";
import { SykmeldingPeriodeDTO } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { Column, Row } from "nav-frontend-grid";

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
            <Row>
              <Column className="col-sm-6">
                <p className="sykmeldingMotebehovVisning__boksRad--tittel">
                  {tilLesbarPeriodeMedArUtenManednavn(periode.fom, periode.tom)}
                </p>
              </Column>
              <Column className="col-sm-6">
                <p className="sykmeldingMotebehovVisning__boksRad--tittel">
                  {kolonne2Tekst(periode)}
                </p>
              </Column>
            </Row>
          </div>
        );
      })}
    </div>
  );
}
