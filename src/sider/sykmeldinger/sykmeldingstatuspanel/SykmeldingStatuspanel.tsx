import React from "react";
import {
  Arbeidsgiver,
  Orgnummer,
  SendtDato,
  Sykmeldingstatus,
} from "./SykmeldingStatuspanelOpplysning";
import {
  SykmeldingOldFormat,
  SykmeldingStatus,
} from "@/data/sykmelding/types/SykmeldingOldFormat";

interface Props {
  sykmelding: SykmeldingOldFormat;
}

export default function SykmeldingStatuspanel({ sykmelding }: Props) {
  switch (sykmelding.status) {
    case SykmeldingStatus.SENDT:
    case SykmeldingStatus.TIL_SENDING: {
      return (
        <div className="grid grid-cols-2 gap-x-4">
          <Sykmeldingstatus sykmelding={sykmelding} />
          <SendtDato sykmelding={sykmelding} />
          <Arbeidsgiver sykmelding={sykmelding} />
          <Orgnummer sykmelding={sykmelding} />
        </div>
      );
    }
    case SykmeldingStatus.AVBRUTT: {
      return (
        <div className="grid grid-cols-2 gap-2">
          <Sykmeldingstatus sykmelding={sykmelding} />
          <SendtDato sykmelding={sykmelding} />
        </div>
      );
    }
    case SykmeldingStatus.UTGAATT: {
      return <Sykmeldingstatus sykmelding={sykmelding} />;
    }
    default: {
      return null;
    }
  }
}
