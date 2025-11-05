import React from "react";
import SykmeldingStatuspanel from "../sykmeldingstatuspanel/SykmeldingStatuspanel";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { SykmeldingOpplysninger } from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/SykmeldingOpplysninger";

interface DinAvbrutteSykmeldingProps {
  sykmelding: SykmeldingOldFormat;
}

const DinAvbrutteSykmelding = ({ sykmelding }: DinAvbrutteSykmeldingProps) => {
  return (
    <>
      <SykmeldingStatuspanel sykmelding={sykmelding} />
      <SykmeldingOpplysninger sykmelding={sykmelding} />
    </>
  );
};

export default DinAvbrutteSykmelding;
