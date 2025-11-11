import React from "react";
import {
  SykmeldingOldFormat,
  SykmeldingStatus,
} from "@/data/sykmelding/types/SykmeldingOldFormat";
import BekreftetSykmelding from "./BekreftetSykmelding";
import AvbruttSykmelding from "./AvbruttSykmelding";
import UtgattSykmelding from "./UtgattSykmelding";
import Feilmelding from "../../../components/Feilmelding";
import AvvistSykmelding from "./avvisteSykmeldinger/AvvistSykmelding";
import { BehandlingsutfallStatusDTO } from "@/data/sykmelding/types/BehandlingsutfallStatusDTO";
import { SendtSykmelding } from "@/sider/sykmeldinger/sykmelding/SendtSykmelding";
import NySykmelding from "@/sider/sykmeldinger/sykmelding/NySykmelding";
import EgenmeldtKoronaSykmelding from "@/sider/sykmeldinger/sykmelding/EgenmeldtKoronaSykmelding";

interface Props {
  sykmelding?: SykmeldingOldFormat;
  arbeidsgiversSykmelding?: SykmeldingOldFormat;
}

export default function Sykmelding({
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
    return <SendtSykmelding sykmelding={sykmelding} />;
  } else if (
    arbeidsgiversSykmelding &&
    sykmelding.status === SykmeldingStatus.BEKREFTET
  ) {
    return <BekreftetSykmelding sykmelding={sykmelding} />;
  } else if (sykmelding.status === SykmeldingStatus.UTGAATT) {
    return <UtgattSykmelding sykmelding={sykmelding} />;
  } else if (sykmelding.status === SykmeldingStatus.NY) {
    return <NySykmelding sykmelding={sykmelding} />;
  } else if (sykmelding.status === SykmeldingStatus.AVBRUTT) {
    return <AvbruttSykmelding sykmelding={sykmelding} />;
  }
  return <Feilmelding tittel="Sykmeldingen har ukjent status" />;
}
