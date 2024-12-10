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
import { DinSykmelding } from "@/sider/sykmeldinger/sykmelding/DinSykmelding";
import EgenmeldtKoronaSykmelding from "@/sider/sykmeldinger/sykmelding/EgenmeldtKoronaSykmelding";

interface Props {
  dinSykmelding?: SykmeldingOldFormat;
  arbeidsgiversSykmelding?: SykmeldingOldFormat;
}

export function SykmeldingSide({
  dinSykmelding,
  arbeidsgiversSykmelding,
}: Props) {
  if (!dinSykmelding) {
    return <Feilmelding tittel="Fant ikke sykmelding" />;
  }
  if (
    dinSykmelding.behandlingsutfall.status ===
    BehandlingsutfallStatusDTO.INVALID
  ) {
    return <AvvistSykmelding sykmelding={dinSykmelding} />;
  }

  if (dinSykmelding.egenmeldt) {
    return <EgenmeldtKoronaSykmelding sykmelding={dinSykmelding} />;
  } else if (
    dinSykmelding.status === SykmeldingStatus.SENDT &&
    arbeidsgiversSykmelding
  ) {
    return (
      <DinSendteSykmelding
        dinSykmelding={dinSykmelding}
        arbeidsgiversSykmelding={arbeidsgiversSykmelding}
      />
    );
  } else if (
    arbeidsgiversSykmelding &&
    dinSykmelding.status === SykmeldingStatus.BEKREFTET
  ) {
    return (
      <DinBekreftedeSykmelding
        dinSykmelding={dinSykmelding}
        arbeidsgiversSykmelding={arbeidsgiversSykmelding}
      />
    );
  } else if (dinSykmelding.status === SykmeldingStatus.UTGAATT) {
    return <DinUtgaatteSykmelding sykmelding={dinSykmelding} />;
  } else if (dinSykmelding.status === SykmeldingStatus.NY) {
    return <DinSykmelding sykmelding={dinSykmelding} />;
  } else if (dinSykmelding.status === SykmeldingStatus.AVBRUTT) {
    return <DinAvbrutteSykmelding sykmelding={dinSykmelding} />;
  }
  return <Feilmelding tittel="Sykmeldingen har ukjent status" />;
}
