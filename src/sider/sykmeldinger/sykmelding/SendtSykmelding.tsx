import React from "react";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { SykmeldingOpplysninger } from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/SykmeldingOpplysninger";
import SykmeldingStatuspanel from "../sykmeldingstatuspanel/SykmeldingStatuspanel";

interface Props {
  sykmelding: SykmeldingOldFormat;
}

export function SendtSykmelding({ sykmelding }: Props) {
  return (
    <>
      <SykmeldingStatuspanel sykmelding={sykmelding} />
      <SykmeldingOpplysninger sykmelding={sykmelding} />
    </>
  );
}
