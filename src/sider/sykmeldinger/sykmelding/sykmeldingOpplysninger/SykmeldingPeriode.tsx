import React from "react";
import { SykmeldingPeriodeDTO } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { tilLesbarPeriodeMedArstall } from "@/utils/datoUtils";
import { Nokkelopplysning } from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/Nokkelopplysning";

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

interface SykmeldingPeriodeProps {
  periode: SykmeldingPeriodeDTO;
  antallDager: number;
}

const SykmeldingPeriode = (sykmeldingPeriodeProps: SykmeldingPeriodeProps) => {
  const { periode, antallDager = 1 } = sykmeldingPeriodeProps;
  const dayText = antallDager === 1 ? texts.daySingle : texts.dayMultiple;

  return (
    <Nokkelopplysning
      label={texts.title}
      className={`pb-4 mb-4 border-solid border-0 border-b border-nav-gray-400`}
    >
      <p className="mb-0">
        <strong>{tilLesbarPeriodeMedArstall(periode.fom, periode.tom)}</strong>{" "}
        &bull; {antallDager}&nbsp;{dayText}
      </p>
      {periode.grad ? (
        <p className="mb-0">
          {periode.grad} % sykmeldt
          {periode.reisetilskudd && periode.grad > 0 && periode.grad < 100
            ? ` ${texts.reisetilskudd}`
            : null}
        </p>
      ) : (
        ""
      )}
      {periode.behandlingsdager ? (
        <p>
          {periode.behandlingsdager} {texts.behandlingsdager}
        </p>
      ) : null}
      {periode.reisetilskudd && periode.grad === null ? (
        <p>{texts.reisetilskuddTitle}</p>
      ) : null}
      {periode.avventende ? (
        <Nokkelopplysning
          label={texts.avventendeInspill}
          className={"[&]:mb-0"}
        >
          {periode.avventende}
        </Nokkelopplysning>
      ) : null}
    </Nokkelopplysning>
  );
};

export default SykmeldingPeriode;
