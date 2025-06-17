import React, { ReactElement } from "react";
import {
  SykmeldingOldFormat,
  SykmeldingStatus,
} from "@/data/sykmelding/types/SykmeldingOldFormat";
import AvvistSykmeldingStatuspanel from "./AvvistSykmeldingStatuspanel";
import AvvistSykmeldingAlert from "./AvvistSykmeldingAlert";
import { SykmeldingOpplysninger } from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/SykmeldingOpplysninger";

interface Props {
  sykmelding: SykmeldingOldFormat;
}

export default function AvvistSykmelding({ sykmelding }: Props): ReactElement {
  return (
    <>
      <AvvistSykmeldingAlert sykmelding={sykmelding} />
      {sykmelding.status === SykmeldingStatus.BEKREFTET && (
        <AvvistSykmeldingStatuspanel sykmelding={sykmelding} />
      )}
      <div className="mb-8">
        <SykmeldingOpplysninger sykmelding={sykmelding} />
      </div>
    </>
  );
}
