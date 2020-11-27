import React from "react";
import { sykmeldingstatuser } from "@navikt/digisyfo-npm";
import {
  Sykmeldingstatus,
  SendtDato,
  Arbeidsgiver,
  Orgnummer,
} from "./SykmeldingStatuspanelOpplysning";
import { sykmelding as sykmeldingPt } from "../../propTypes";
import GjenapneSykmelding from "./GjenapneSykmelding";
import Statuspanel, { Statusopplysninger } from "../Statuspanel";

export const Nokkelopplysninger = ({ sykmelding }) => {
  switch (sykmelding.status) {
    case sykmeldingstatuser.SENDT:
    case sykmeldingstatuser.TIL_SENDING: {
      return (
        <Statusopplysninger>
          <Sykmeldingstatus sykmelding={sykmelding} />
          <SendtDato sykmelding={sykmelding} />
          <Arbeidsgiver sykmelding={sykmelding} />
          <Orgnummer sykmelding={sykmelding} />
        </Statusopplysninger>
      );
    }
    case sykmeldingstatuser.AVBRUTT: {
      return (
        <Statusopplysninger>
          <Sykmeldingstatus sykmelding={sykmelding} />
          <SendtDato sykmelding={sykmelding} />
        </Statusopplysninger>
      );
    }
    case sykmeldingstatuser.UTGAATT: {
      return (
        <Statusopplysninger>
          <Sykmeldingstatus sykmelding={sykmelding} />
        </Statusopplysninger>
      );
    }
    default: {
      return null;
    }
  }
};

Nokkelopplysninger.propTypes = {
  sykmelding: sykmeldingPt,
};

const SykmeldingStatuspanel = ({ sykmelding }) => {
  return (
    <Statuspanel>
      <Nokkelopplysninger sykmelding={sykmelding} />
      {sykmelding.status === sykmeldingstatuser.AVBRUTT &&
        !sykmelding.egenmeldt && <GjenapneSykmelding />}
    </Statuspanel>
  );
};

SykmeldingStatuspanel.propTypes = {
  sykmelding: sykmeldingPt,
};

export default SykmeldingStatuspanel;
