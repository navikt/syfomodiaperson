import { connect } from "react-redux";
import GlobalNavigasjon from "../components/GlobalNavigasjon";
import * as motebehovActions from "../actions/motebehov_actions";
import * as moterActions from "../actions/moter_actions";
import * as oppfoelgingsdialogerActions from "../actions/oppfoelgingsdialoger_actions";
import * as oppfolgingsplanerLPSActions from "../actions/oppfolgingsplanerlps_actions";
import * as personOppgaverActions from "../actions/personoppgave_actions";

export const mapStateToProps = (state, ownProps) => {
  return {
    fnr: ownProps.fnr,
    aktivtMenypunkt: ownProps.aktivtMenypunkt,
    motebehovReducer: state.motebehov,
    moterReducer: state.moter,
    oppfolgingsplanerReducer: state.oppfoelgingsdialoger,
    personOppgaverReducer: state.personoppgaver,
    oppfolgingsplanerLPSReducer: state.oppfolgingsplanerlps,
  };
};

const GlobalNavigasjonContainer = connect(
  mapStateToProps,
  Object.assign(
    {},
    motebehovActions,
    moterActions,
    oppfoelgingsdialogerActions,
    personOppgaverActions,
    oppfolgingsplanerLPSActions
  )
)(GlobalNavigasjon);

export default GlobalNavigasjonContainer;
