import React from "react";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import BekreftetSykmeldingStatuspanel from "../sykmeldingstatuspanel/BekreftetSykmeldingStatuspanel";
import { SykmeldingOpplysninger } from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/SykmeldingOpplysninger";

interface Props {
  sykmelding: SykmeldingOldFormat;
}

export default function BekreftetSykmelding({ sykmelding }: Props) {
  return (
    <>
      <BekreftetSykmeldingStatuspanel sykmelding={sykmelding} />
      <SykmeldingOpplysninger sykmelding={sykmelding} />
    </>
  );
}
