import React from "react";
import PropTypes from "prop-types";
import { Checkbox } from "nav-frontend-skjema";
import { Hovedknapp } from "nav-frontend-knapper";
import { gamleSMStatuser } from "../../../utils/sykmeldinger/sykmeldingstatuser";

const texts = {
  confirm: "Bekreft",
  confirmCheckboxLabel:
    "Jeg bekrefter at jeg har lest at sykmeldingen er avvist",
};

export const BekreftAvvistSykmelding = ({ sykmelding }) => {
  return (
    sykmelding.status === gamleSMStatuser.NY && (
      <React.Fragment>
        <div>
          <Checkbox
            className="bekreftLestAvvistSykmelding bekreftCheckboksPanel"
            label={texts.confirmCheckboxLabel}
            disabled
          />
        </div>
        <div className="knapperad">
          <Hovedknapp type="submit" disabled>
            {texts.confirm}
          </Hovedknapp>
        </div>
      </React.Fragment>
    )
  );
};

BekreftAvvistSykmelding.propTypes = {
  sykmelding: PropTypes.object,
};
