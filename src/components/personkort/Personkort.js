import React, { Component } from "react";
import PropTypes from "prop-types";
import { Utvidbar } from "@navikt/digisyfo-npm";
import PersonkortVisning from "./PersonkortVisning";
import { PERSONKORTVISNING_TYPE } from "../../konstanter";
import PersonkortHeader from "./PersonkortHeader";
import OversiktLink from "./OversiktLink";

const texts = {
  buttons: {
    sykmeldt: "Kontaktinformasjon",
    leder: "Nærmeste leder",
    fastlege: "Fastlege",
    enhet: "Behandlende enhet",
  },
};

class Personkort extends Component {
  constructor() {
    super();
    this.state = {
      visning: PERSONKORTVISNING_TYPE.SYKMELDT,
    };
    this.byttVisning = this.byttVisning.bind(this);
  }

  componentDidMount() {
    const { actions, navbruker } = this.props;
    const brukerFnr = navbruker.kontaktinfo && navbruker.kontaktinfo.fnr;
    if (brukerFnr) {
      actions.hentDiskresjonskode(brukerFnr);
      actions.hentEgenansatt(brukerFnr);
      actions.hentFastleger(brukerFnr);
      actions.hentLedere(brukerFnr);
      actions.hentSykmeldinger(brukerFnr);
    }
  }

  componentDidUpdate(prevProps) {
    const { actions, navbruker, ledere } = this.props;
    const brukerFnr = navbruker.kontaktinfo && navbruker.kontaktinfo.fnr;

    if (ledere !== prevProps.ledere) {
      actions.hentOppfolgingstilfelleperioder(brukerFnr);
    }
  }

  byttVisning(visning) {
    this.setState({
      visning,
    });
  }

  render() {
    const {
      diskresjonskode,
      egenansatt,
      navbruker,
      oppfolgingstilfelleperioder,
      sykmeldinger,
    } = this.props;
    const visning = this.state.visning;

    return (
      <div className="personkort">
        <OversiktLink />
        <Utvidbar
          erApen={false}
          tittel={
            <PersonkortHeader
              diskresjonskode={diskresjonskode}
              egenansatt={egenansatt}
              navbruker={navbruker}
              oppfolgingstilfelleperioder={oppfolgingstilfelleperioder}
              sykmeldinger={sykmeldinger}
            />
          }
        >
          <div>
            <ul>
              <li>
                <button
                  className={`${
                    visning === PERSONKORTVISNING_TYPE.SYKMELDT &&
                    "personkort__knapp--aktiv"
                  }`}
                  aria-pressed={visning === PERSONKORTVISNING_TYPE.SYKMELDT}
                  onClick={() => {
                    this.byttVisning(PERSONKORTVISNING_TYPE.SYKMELDT);
                  }}
                >
                  {texts.buttons.sykmeldt}
                </button>
              </li>
              <li>
                <button
                  className={`${
                    visning === PERSONKORTVISNING_TYPE.LEDER &&
                    "personkort__knapp--aktiv"
                  }`}
                  aria-pressed={visning === PERSONKORTVISNING_TYPE.LEDER}
                  onClick={() => {
                    this.byttVisning(PERSONKORTVISNING_TYPE.LEDER);
                  }}
                >
                  {texts.buttons.leder}
                </button>
              </li>
              <li>
                <button
                  className={`${
                    visning === PERSONKORTVISNING_TYPE.LEGE &&
                    "personkort__knapp--aktiv"
                  }`}
                  aria-pressed={visning === PERSONKORTVISNING_TYPE.LEGE}
                  onClick={() => {
                    this.byttVisning(PERSONKORTVISNING_TYPE.LEGE);
                  }}
                >
                  {texts.buttons.fastlege}
                </button>
              </li>
              <li>
                <button
                  className={`${
                    visning === PERSONKORTVISNING_TYPE.ENHET &&
                    "personkort__knapp--aktiv"
                  }`}
                  aria-pressed={visning === PERSONKORTVISNING_TYPE.ENHET}
                  onClick={() => {
                    this.byttVisning(PERSONKORTVISNING_TYPE.ENHET);
                  }}
                >
                  {texts.buttons.enhet}
                </button>
              </li>
            </ul>

            <div aria-live="polite">
              <PersonkortVisning {...this.props} visning={visning} />
            </div>
          </div>
        </Utvidbar>
      </div>
    );
  }
}
Personkort.propTypes = {
  actions: PropTypes.object,
  diskresjonskode: PropTypes.object,
  egenansatt: PropTypes.object,
  fastleger: PropTypes.object,
  navbruker: PropTypes.object,
  personadresse: PropTypes.object,
  ledere: PropTypes.array,
  behandlendeEnhet: PropTypes.object,
  oppfolgingstilfelleperioder: PropTypes.object,
  sykmeldinger: PropTypes.arrayOf(PropTypes.object),
};
export default Personkort;
