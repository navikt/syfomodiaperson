import React from "react";
import {
  SykmeldingOldFormat,
  SykmeldingStatus,
} from "@/data/sykmelding/types/SykmeldingOldFormat";
import DinBekreftedeSykmelding from "./DinBekreftedeSykmelding";
import DinAvbrutteSykmelding from "./DinAvbrutteSykmelding";
import DinUtgaatteSykmelding from "./DinUtgaatteSykmelding";
import Feilmelding from "../../../components/Feilmelding";
import AvvistSykmelding from "./avvisteSykmeldinger/AvvistSykmelding";
import { BehandlingsutfallStatusDTO } from "@/data/sykmelding/types/BehandlingsutfallStatusDTO";
import { DinSendteSykmelding } from "@/sider/sykmeldinger/sykmelding/DinSendteSykmelding";
import DinSykmelding from "@/sider/sykmeldinger/sykmelding/DinSykmelding";
import EgenmeldtKoronaSykmelding from "@/sider/sykmeldinger/sykmelding/EgenmeldtKoronaSykmelding";

interface Props {
  sykmelding?: SykmeldingOldFormat;
  arbeidsgiversSykmelding?: SykmeldingOldFormat;
}

export default function SykmeldingSide({
  sykmelding,
  arbeidsgiversSykmelding,
}: Props) {
  if (!sykmelding) {
    return <Feilmelding tittel="Fant ikke sykmelding" />;
  }
  if (
    sykmelding.behandlingsutfall.status === BehandlingsutfallStatusDTO.INVALID
  ) {
    return <AvvistSykmelding sykmelding={sykmelding} />;
  }

  if (sykmelding.egenmeldt) {
    return <EgenmeldtKoronaSykmelding sykmelding={sykmelding} />;
  } else if (
    sykmelding.status === SykmeldingStatus.SENDT &&
    arbeidsgiversSykmelding
  ) {
    return <DinSendteSykmelding sykmelding={sykmelding} />;
  } else if (
    arbeidsgiversSykmelding &&
    sykmelding.status === SykmeldingStatus.BEKREFTET
  ) {
    return <DinBekreftedeSykmelding sykmelding={sykmelding} />;
  } else if (sykmelding.status === SykmeldingStatus.UTGAATT) {
    return <DinUtgaatteSykmelding sykmelding={sykmelding} />;
  } else if (sykmelding.status === SykmeldingStatus.NY) {
    return <DinSykmelding sykmelding={sykmelding} />;
  } else if (sykmelding.status === SykmeldingStatus.AVBRUTT) {
    return <DinAvbrutteSykmelding sykmelding={sykmelding} />;
  }
  return <Feilmelding tittel="Sykmeldingen har ukjent status" />;
}
