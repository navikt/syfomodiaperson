/* eslint arrow-body-style: ["error", "as-needed"] */
import React from "react";
import PropTypes from "prop-types";
import { tilLesbarDatoMedArstall } from "@navikt/digisyfo-npm";
import { StatusNokkelopplysning, Statusopplysninger } from "../../Statuspanel";
import { gamleSMStatuser } from "../../../utils/sykmeldinger/sykmeldingstatuser";

export const AvvistSykmeldingStatuspanel = ({ sykmelding }) =>
  sykmelding.status === gamleSMStatuser.BEKREFTET ? (
    <div className="panel panel--komprimert statuspanel blokk--xl statuspanel--treKol">
      <Statusopplysninger>
        <StatusNokkelopplysning tittel="Status">
          <p>Avvist av NAV</p>
        </StatusNokkelopplysning>
        <StatusNokkelopplysning tittel="Dato avvist">
          <p>{tilLesbarDatoMedArstall(sykmelding.mottattTidspunkt)}</p>
        </StatusNokkelopplysning>
        <StatusNokkelopplysning tittel="Bekreftet av deg">
          <p>{tilLesbarDatoMedArstall(sykmelding.sendtdato)}</p>
        </StatusNokkelopplysning>
      </Statusopplysninger>
    </div>
  ) : null;

AvvistSykmeldingStatuspanel.propTypes = {
  sykmelding: PropTypes.object,
};
