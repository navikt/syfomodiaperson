import React from "react";
import {
  SykmeldingOldFormat,
  SykmeldingStatus,
} from "@/data/sykmelding/types/SykmeldingOldFormat";
import Feilmelding from "../../../components/Feilmelding";
import { BehandlingsutfallStatusDTO } from "@/data/sykmelding/types/BehandlingsutfallStatusDTO";
import EgenmeldtKoronaSykmelding from "@/sider/sykmeldinger/sykmelding/EgenmeldtKoronaSykmelding";
import SykmeldingStatuspanel from "@/sider/sykmeldinger/sykmeldingstatuspanel/SykmeldingStatuspanel";
import { SykmeldingOpplysninger } from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/SykmeldingOpplysninger";
import BekreftetSykmeldingStatuspanel from "@/sider/sykmeldinger/sykmeldingstatuspanel/BekreftetSykmeldingStatuspanel";
import AvvistSykmeldingAlert from "@/sider/sykmeldinger/sykmelding/avvisteSykmeldinger/AvvistSykmeldingAlert";
import AvvistSykmeldingStatuspanel from "@/sider/sykmeldinger/sykmelding/avvisteSykmeldinger/AvvistSykmeldingStatuspanel";

interface Props {
  sykmelding: SykmeldingOldFormat;
  arbeidsgiversSykmelding?: SykmeldingOldFormat;
}

export default function Sykmelding({
  sykmelding,
  arbeidsgiversSykmelding,
}: Props) {
  if (
    sykmelding.behandlingsutfall.status === BehandlingsutfallStatusDTO.INVALID
  ) {
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

  if (sykmelding.egenmeldt) {
    return <EgenmeldtKoronaSykmelding sykmelding={sykmelding} />;
  } else if (
    sykmelding.status === SykmeldingStatus.SENDT &&
    arbeidsgiversSykmelding
  ) {
    return (
      <>
        <SykmeldingStatuspanel sykmelding={sykmelding} />
        <SykmeldingOpplysninger sykmelding={sykmelding} />
      </>
    );
  } else if (
    arbeidsgiversSykmelding &&
    sykmelding.status === SykmeldingStatus.BEKREFTET
  ) {
    return (
      <>
        <BekreftetSykmeldingStatuspanel sykmelding={sykmelding} />
        <SykmeldingOpplysninger sykmelding={sykmelding} />
      </>
    );
  } else if (sykmelding.status === SykmeldingStatus.UTGAATT) {
    return (
      <>
        <SykmeldingStatuspanel sykmelding={sykmelding} />
        <SykmeldingOpplysninger sykmelding={sykmelding} />
      </>
    );
  } else if (sykmelding.status === SykmeldingStatus.NY) {
    return <SykmeldingOpplysninger sykmelding={sykmelding} />;
  } else if (sykmelding.status === SykmeldingStatus.AVBRUTT) {
    return (
      <>
        <SykmeldingStatuspanel sykmelding={sykmelding} />
        <SykmeldingOpplysninger sykmelding={sykmelding} />
      </>
    );
  }
  return <Feilmelding tittel="Sykmeldingen har ukjent status" />;
}
