import { connect } from 'react-redux';
import GlobalNavigasjon from '../components/GlobalNavigasjon';

export const mapStateToProps = (state, ownProps) => {
    return {
        oppgaver: state.veilederoppgaver.data,
        fnr: ownProps.fnr,
        aktivtMenypunkt: ownProps.aktivtMenypunkt,
    };
};

const GlobalNavigasjonContainer = connect(mapStateToProps)(GlobalNavigasjon);

export default GlobalNavigasjonContainer;
