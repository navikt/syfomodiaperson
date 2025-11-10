import React from "react";
import SykmeldingStatuspanel from "../sykmeldingstatuspanel/SykmeldingStatuspanel";
import { SykmeldingOpplysninger } from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/SykmeldingOpplysninger";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";

interface DinUtgaatteSykmeldingProps {
  sykmelding: SykmeldingOldFormat;
}

const DinUtgatteSykmelding = ({ sykmelding }: DinUtgaatteSykmeldingProps) => {
  return (
    <>
      <SykmeldingStatuspanel sykmelding={sykmelding} />
      <SykmeldingOpplysninger sykmelding={sykmelding} />
    </>
  );
};

export default DinUtgatteSykmelding;
