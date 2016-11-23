import React, { PropTypes } from 'react';
import { Router, Route } from 'react-router';
import NaermesteLedereContainer from '../containers/NaermesteLedereContainer';
import FeilsideContainer from '../containers/FeilsideContainer';
import MotebookingContainer from '../containers/MotebookingContainer';
import BekreftMoteContainer from '../containers/BekreftMoteContainer';
import TidslinjeContainer from '../containers/TidslinjeContainer';

const AppRouter = ({ history }) => {
    return (<Router history={history}>
        <Route path="/sykefravaer" component={FeilsideContainer} />
        <Route path="/sykefravaer/:fnr" component={NaermesteLedereContainer} />
        <Route path="/sykefravaer/:fnr/naermeste-leder" component={NaermesteLedereContainer} />
        <Route path="/sykefravaer/:fnr/mote" component={MotebookingContainer} />
        <Route path="/sykefravaer/:fnr/mote/bekreft/:alternativId" component={BekreftMoteContainer} />
        <Route path="/sykefravaer/:fnr/tidslinjen" component={TidslinjeContainer} />
        <Route path="/sykefravaer/:fnr/tidslinjen/:valgtArbeidssituasjon" component={TidslinjeContainer} />
        <Route path="/" component={FeilsideContainer} />
    </Router>);
};

AppRouter.propTypes = {
    history: PropTypes.object.isRequired,
};

export default AppRouter;
