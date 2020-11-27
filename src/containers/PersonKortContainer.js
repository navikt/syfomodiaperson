import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Personkort from "../components/personkort/Personkort";
import * as egenansattActions from "../actions/egenansatt_actions";
import * as diskresjonskodeActions from "../actions/diskresjonskode_actions";
import * as fastlegeActions from "../actions/fastleger_actions";
import * as ledereActions from "../actions/ledere_actions";
import * as oppfolgingstilfelleperioderActions from "../actions/oppfolgingstilfelleperioder_actions";
import * as sykmeldingerActions from "../actions/sykmeldinger_actions";

export function mapDispatchToProps(dispatch) {
  const actions = Object.assign(
    {},
    diskresjonskodeActions,
    egenansattActions,
    fastlegeActions,
    ledereActions,
    oppfolgingstilfelleperioderActions,
    sykmeldingerActions
  );
  return {
    actions: bindActionCreators(actions, dispatch),
  };
}

export const mapStateToProps = (state) => {
  return {
    ledetekster: state.ledetekster.data,
    behandlendeEnhet: state.behandlendeEnhet.data,
    diskresjonskode: state.diskresjonskode,
    egenansatt: state.egenansatt,
    fastleger: state.fastleger,
    ledere: state.ledere.allLedere,
    navbruker: state.navbruker.data,
    personadresse: state.personadresse.data,
    oppfolgingstilfelleperioder: state.oppfolgingstilfelleperioder,
    sykmeldinger: state.sykmeldinger.data,
  };
};

const PersonkortContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Personkort);

export default PersonkortContainer;
