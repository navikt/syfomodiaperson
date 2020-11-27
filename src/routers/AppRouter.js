import React from "react";
import PropTypes from "prop-types";
import { Router, Route } from "react-router";
import IngenBrukerContainer from "../containers/IngenBrukerContainer";
import MotebookingContainer from "../containers/MotebookingContainer";
import AvbrytMoteContainer from "../containers/AvbrytMoteContainer";
import BekreftMoteContainer from "../containers/BekreftMoteContainer";
import SykmeldingerContainer from "../containers/SykmeldingerContainer";
import SykepengesoknaderContainer from "../containers/SykepengesoknaderContainer";
import SykepengesoknadContainer from "../containers/SykepengesoknadContainer";
import OppfoelgingsPlanerOversiktContainer from "../containers/OppfoelgingsPlanerOversiktContainer";
import OppfoelgingsplanContainer from "../containers/OppfoelgingsplanContainer";
import DinSykmeldingContainer from "../containers/DinSykmeldingContainer";
import HistorikkContainer from "../containers/HistorikkContainer";
import { erGyldigFodselsnummer } from "../utils/frnValideringUtils";
import MotelandingssideContainer from "../containers/MotelandingssideContainer";
import MotebehovContainer from "../containers/MotebehovContainer";
import VedtakContainer from "../containers/VedtakContainer";

const AppRouter = ({ history }) => {
  const fnr = window.location.pathname.split("/")[2];
  if (!erGyldigFodselsnummer(fnr)) {
    return (
      <Router history={history}>
        <Route path="*" component={IngenBrukerContainer} />
      </Router>
    );
  }

  return (
    <Router history={history}>
      <Route path="/sykefravaer/:fnr" component={SykmeldingerContainer} />
      <Route path="/sykefravaer/:fnr/logg" component={HistorikkContainer} />
      <Route
        path="/sykefravaer/:fnr/moteoversikt"
        component={MotelandingssideContainer}
      />
      <Route path="/sykefravaer/:fnr/mote" component={MotebookingContainer} />
      <Route
        path="/sykefravaer/:fnr/motebehov"
        component={MotebehovContainer}
      />
      <Route
        path="/sykefravaer/:fnr/mote/:moteUuid/avbryt"
        component={AvbrytMoteContainer}
      />
      <Route
        path="/sykefravaer/:fnr/mote/bekreft/:alternativId"
        component={BekreftMoteContainer}
      />
      <Route
        path="/sykefravaer/:fnr/sykmeldinger"
        component={SykmeldingerContainer}
      />
      <Route
        path="/sykefravaer/:fnr/sykepengesoknader"
        component={SykepengesoknaderContainer}
      />
      <Route
        path="/sykefravaer/:fnr/sykepengesoknader/:sykepengesoknadId"
        component={SykepengesoknadContainer}
      />
      <Route
        path="/sykefravaer/:fnr/sykmeldinger/:sykmeldingId"
        component={DinSykmeldingContainer}
      />
      <Route
        path="/sykefravaer/:fnr/oppfoelgingsplaner"
        component={OppfoelgingsPlanerOversiktContainer}
      />
      <Route
        path="/sykefravaer/:fnr/oppfoelgingsplaner/:oppfoelgingsdialogId"
        component={OppfoelgingsplanContainer}
      />
      <Route path="/sykefravaer/:fnr/vedtak" component={VedtakContainer} />
      <Route path="/sykefravaer/:fnr/*" component={SykmeldingerContainer} />
      <Route path="/sykefravaer" component={IngenBrukerContainer} />
    </Router>
  );
};

AppRouter.propTypes = {
  history: PropTypes.object.isRequired,
};

export default AppRouter;
