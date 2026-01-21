import React from "react";
import { tilLesbarPeriodeMedArUtenManednavn } from "@/utils/datoUtils";
import { SykmeldingPeriodeDTO } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { BodyShort, HGrid } from "@navikt/ds-react";

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
    <div>
      <BodyShort size="small" weight="semibold">
        Perioder
      </BodyShort>
      {perioder.map((periode, index) => {
        return (
          <HGrid key={index} gap="space-16" columns={2}>
            <BodyShort size="small">
              {tilLesbarPeriodeMedArUtenManednavn(periode.fom, periode.tom)}
            </BodyShort>
            <BodyShort size="small">{kolonne2Tekst(periode)}</BodyShort>
          </HGrid>
        );
      })}
    </div>
  );
}
