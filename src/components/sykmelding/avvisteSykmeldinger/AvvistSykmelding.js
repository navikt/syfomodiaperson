import React from "react";
import PropTypes from "prop-types";
import { AvvistSykmeldingStatuspanel } from "./AvvistSykmeldingStatuspanel";
import { AvvistSykmeldingPanel } from "./AvvistSykmeldingPanel";
import { BekreftAvvistSykmelding } from "./BekreftAvvistSykmelding";
import DineSykmeldingOpplysninger from "../sykmeldingOpplysninger/DineSykmeldingOpplysninger";

const AvvistSykmelding = ({ sykmelding }) => {
  return (
    <div>
      <AvvistSykmeldingStatuspanel sykmelding={sykmelding} />
      <AvvistSykmeldingPanel sykmelding={sykmelding} />
      <div className="panel blokk">
        <DineSykmeldingOpplysninger sykmelding={sykmelding} />
      </div>
      <BekreftAvvistSykmelding sykmelding={sykmelding} />
    </div>
  );
};

AvvistSykmelding.propTypes = {
  sykmelding: PropTypes.object,
};

export default AvvistSykmelding;
