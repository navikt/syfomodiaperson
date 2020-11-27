import React, { Component } from "react";
import PropTypes from "prop-types";
import { browserHistory } from "react-router";
import * as menypunkter from "../enums/menypunkter";
import cn from "classnames";
import UnfinishedTasks from "./UnfinishedTasks";
import { numberOfTasks } from "../utils/GlobalNavigasjonUtils";

const historikkMenypunkt = {
  navn: "Logg",
  sti: "logg",
  menypunkt: menypunkter.HISTORIKK,
};

const motemodulMenypunkt = {
  navn: "Dialogmøter",
  sti: "moteoversikt",
  menypunkt: menypunkter.MOETEPLANLEGGER,
};

const sykmeldingerMenypunkt = {
  navn: "Sykmeldinger",
  sti: "sykmeldinger",
  menypunkt: menypunkter.SYKMELDINGER,
};

const sykepengesoknadMenypunkt = {
  navn: "Søknader om sykepenger",
  sti: "sykepengesoknader",
  menypunkt: menypunkter.SYKEPENGESOKNADER,
};

const oppfoelgingsplanMenypunkt = {
  navn: "Oppfølgings&shy;planer",
  sti: "oppfoelgingsplaner",
  menypunkt: menypunkter.OPPFOELGINGSPLANER,
};

const vedtakMenypunkt = {
  navn: "Vedtak",
  sti: "vedtak",
  menypunkt: menypunkter.VEDTAK,
};

class GlobalNavigasjon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      focusIndex: -1,
    };
  }

  componentDidMount() {
    const { fnr } = this.props;
    this.props.hentMotebehov(fnr);
    this.props.hentMoter(fnr);
    this.props.hentOppfoelgingsdialoger(fnr);
    this.props.hentPersonOppgaver(fnr);
  }

  setFocus(fokusId) {
    const ref = this.getRef(fokusId);
    this.refs[ref].focus();
  }

  setFocusIndex(index) {
    this.setState({
      focus: index,
    });
  }

  getRef(index) {
    return `js-${index}`;
  }

  handleKeyDown(e) {
    const DOWN = 40;
    const UP = 38;
    switch (e.keyCode) {
      case DOWN: {
        e.preventDefault();
        const focusIndex = this.state.focus + 1;
        if (focusIndex === this.menypunkter.length) {
          return;
        }
        this.setState({
          focusIndex,
        });
        this.setFocus(focusIndex);
        return;
      }
      case UP: {
        e.preventDefault();
        const focusIndex = this.state.focus - 1;
        if (focusIndex === -1) {
          return;
        }
        this.setState({
          focusIndex,
        });
        this.setFocus(focusIndex);
        break;
      }
      default:
        break;
    }
  }

  render() {
    const {
      fnr,
      aktivtMenypunkt,
      motebehovReducer,
      moterReducer,
      oppfolgingsplanerReducer,
      personOppgaverReducer,
      oppfolgingsplanerLPSReducer,
    } = this.props;
    this.menypunkter = [
      historikkMenypunkt,
      sykmeldingerMenypunkt,
      sykepengesoknadMenypunkt,
      oppfoelgingsplanMenypunkt,
      motemodulMenypunkt,
      vedtakMenypunkt,
    ];

    return (
      <ul aria-label="Navigasjon" className="navigasjon">
        {this.menypunkter.map(({ navn, sti, menypunkt }, index) => {
          const className = cn("navigasjonspanel", {
            "navigasjonspanel--aktiv": menypunkt === aktivtMenypunkt,
          });
          const tasks = numberOfTasks(
            menypunkt,
            motebehovReducer,
            moterReducer,
            oppfolgingsplanerReducer,
            personOppgaverReducer,
            oppfolgingsplanerLPSReducer
          );
          return (
            <li key={index} className="navigasjon__element">
              <a
                ref={this.getRef(index)}
                className={className}
                href={`/sykefravaer/${fnr}/${sti}`}
                onFocus={() => {
                  this.setFocusIndex(index);
                }}
                onKeyDown={(e) => {
                  this.handleKeyDown(e);
                }}
                onClick={(e) => {
                  e.preventDefault();
                  // Dette gjøres slik for å slippe å laste siden på nytt.
                  // <Link /> fra react-router kan ikke brukes da den ikke støtter ref-attributtet.
                  browserHistory.push(`/sykefravaer/${fnr}/${sti}`);
                }}
              >
                <span
                  className="navigasjon__element__tekst"
                  dangerouslySetInnerHTML={{ __html: navn }}
                />
                {tasks > 0 && (
                  <UnfinishedTasks tasks={tasks} menypunkt={menypunkt} />
                )}
              </a>
            </li>
          );
        })}
      </ul>
    );
  }
}

GlobalNavigasjon.propTypes = {
  fnr: PropTypes.string,
  aktivtMenypunkt: PropTypes.string,
  motebehovReducer: PropTypes.object,
  hentMotebehov: PropTypes.func,
  moterReducer: PropTypes.object,
  hentMoter: PropTypes.func,
  oppfolgingsplanerReducer: PropTypes.object,
  personOppgaverReducer: PropTypes.object,
  oppfolgingsplanerLPSReducer: PropTypes.object,
  hentOppfoelgingsdialoger: PropTypes.func,
  hentPersonOppgaver: PropTypes.func,
};

export default GlobalNavigasjon;
