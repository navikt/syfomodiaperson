import React from "react";
import { SykmeldingPeriodeDTO } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { tilLesbarPeriodeMedArstall } from "@/utils/datoUtils";
import { BodyLong, Heading } from "@navikt/ds-react";

const texts = {
  title: "Periode",
  daySingle: "Dag",
  dayMultiple: "Dager",
  avventende: "Avventende sykmelding",
  avventendeInspill: "Innspill til arbeidsgiver om tilrettelegging",
  behandlingsdager: "behandlingsdager",
  reisetilskudd: "med reisetilskudd",
  reisetilskuddTitle: "Reisetilskudd",
};

interface Props {
  periode: SykmeldingPeriodeDTO;
  antallDager: number;
}

export function SykmeldingPeriode({ periode, antallDager = 1 }: Props) {
  const dayText = antallDager === 1 ? texts.daySingle : texts.dayMultiple;

  return (
    <div
      className={`[&:not(:only-child)]:pb-4 mb-4 border-solid border-0 [&:not(:only-child)]:border-b border-ax-neutral-500`}
    >
      <Heading size="xsmall" level="3" className="mb-1">
        {texts.title}
      </Heading>
      <BodyLong size="small">
        <strong>{tilLesbarPeriodeMedArstall(periode.fom, periode.tom)}</strong>{" "}
        &bull; {antallDager}&nbsp;{dayText}
      </BodyLong>
      {periode.grad && (
        <BodyLong size="small">
          {periode.grad} % sykmeldt
          {periode.reisetilskudd &&
            periode.grad > 0 &&
            periode.grad < 100 &&
            ` ${texts.reisetilskudd}`}
        </BodyLong>
      )}
      {periode.behandlingsdager && (
        <BodyLong size="small">
          {periode.behandlingsdager} {texts.behandlingsdager}
        </BodyLong>
      )}
      {periode.reisetilskudd && periode.grad === null && (
        <BodyLong size="small">{texts.reisetilskuddTitle}</BodyLong>
      )}
      {periode.avventende && (
        <div>
          <Heading size="xsmall" level="3" className="mb-1">
            {texts.avventendeInspill}
          </Heading>
          <BodyLong size="small">{periode.avventende}</BodyLong>
        </div>
      )}
    </div>
  );
}
