import React from "react";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { SykmeldingOpplysninger } from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/SykmeldingOpplysninger";

interface Props {
  sykmelding: SykmeldingOldFormat;
}

export default function NySykmelding({ sykmelding }: Props) {
  return <SykmeldingOpplysninger sykmelding={sykmelding} />;
}
