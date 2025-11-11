import React from "react";
import SykmeldingStatuspanel from "../sykmeldingstatuspanel/SykmeldingStatuspanel";
import { SykmeldingOpplysninger } from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/SykmeldingOpplysninger";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";

interface Props {
  sykmelding: SykmeldingOldFormat;
}

export default function UtgattSykmelding({ sykmelding }: Props) {
  return (
    <>
      <SykmeldingStatuspanel sykmelding={sykmelding} />
      <SykmeldingOpplysninger sykmelding={sykmelding} />
    </>
  );
}
