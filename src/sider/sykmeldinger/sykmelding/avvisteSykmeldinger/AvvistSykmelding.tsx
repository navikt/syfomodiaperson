import React, { ReactElement } from "react";
import {
  SykmeldingOldFormat,
  SykmeldingStatus,
} from "@/data/sykmelding/types/SykmeldingOldFormat";
import AvvistSykmeldingStatuspanel from "./AvvistSykmeldingStatuspanel";
import { AvvistSykmeldingPanel } from "./AvvistSykmeldingPanel";
import BekreftAvvistSykmelding from "./BekreftAvvistSykmelding";
import { SykmeldingOpplysninger } from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/SykmeldingOpplysninger";

interface AvvistSykmeldingProps {
  sykmelding: SykmeldingOldFormat;
}

const AvvistSykmelding = ({
  sykmelding,
}: AvvistSykmeldingProps): ReactElement => {
  return (
    <>
      {sykmelding.status === SykmeldingStatus.BEKREFTET && (
        <AvvistSykmeldingStatuspanel sykmelding={sykmelding} />
      )}
      <AvvistSykmeldingPanel sykmelding={sykmelding} />
      <div className="blokk">
        <SykmeldingOpplysninger sykmelding={sykmelding} />
      </div>
      {sykmelding.status === SykmeldingStatus.NY && <BekreftAvvistSykmelding />}
    </>
  );
};

export default AvvistSykmelding;
