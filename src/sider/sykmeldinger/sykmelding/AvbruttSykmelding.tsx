import React from "react";
import SykmeldingStatuspanel from "../sykmeldingstatuspanel/SykmeldingStatuspanel";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { SykmeldingOpplysninger } from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/SykmeldingOpplysninger";

interface Props {
  sykmelding: SykmeldingOldFormat;
}

export default function AvbruttSykmelding({ sykmelding }: Props) {
  return (
    <>
      <SykmeldingStatuspanel sykmelding={sykmelding} />
      <SykmeldingOpplysninger sykmelding={sykmelding} />
    </>
  );
}
