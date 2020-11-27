import React, { Component } from "react";
import PropTypes from "prop-types";
import { Knapp } from "nav-frontend-knapper";
import {
  tilLesbarDatoMedArstall,
  tilLesbarPeriodeMedArstall,
} from "@navikt/digisyfo-npm";
import {
  soknadEllerSykepengesoknad,
  sykepengesoknad as sykepengesoknadPt,
} from "../../propTypes";
import Lightbox from "../Lightbox";

const texts = {
  dato: {
    tittel: "Planlagt søknad",
    info: "Du kan fylle ut denne søknaden",
    fremtidig: "Kan fylles ut fra",
  },
  status: {
    fremtidig: "Planlagt",
    sender: "Sender...",
    utkastTilKorrigering: "Utkast til endring",
  },
  tittel: "Søknad om sykepenger",
  teaserTekst: "Gjelder perioden",
};

const textDatoInfo = (dato) => {
  return `${texts.dato.info} ${dato}`;
};

const textDatoFremtidig = (dato) => {
  return `${texts.dato.fremtidig} ${dato}`;
};

const textSoknadStatus = (status) => {
  switch (status) {
    case "FREMTIDIG":
      return texts.status.fremtidig;
    case "TIL_SENDING":
      return texts.status.sender;
    case "UTKAST_TIL_KORRIGERING":
      return texts.utkastTilKorrigering;
    default:
      return "";
  }
};

const textTeaserText = (periode) => {
  return `${texts.teaserTekst} ${periode}`;
};

const SoknadLightbox = ({ soknad, onClose }) => {
  return (
    <Lightbox onClose={onClose}>
      <h3 className="panel__tittel">{texts.dato.tittel}</h3>
      <p>{textDatoInfo(tilLesbarDatoMedArstall(soknad.tom))}</p>
      <div className="knapperad">
        <Knapp onClick={onClose}>Lukk</Knapp>
      </div>
    </Lightbox>
  );
};

SoknadLightbox.propTypes = {
  soknad: sykepengesoknadPt,
  onClose: PropTypes.func,
};

class FremtidigSoknadTeaser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vis: false,
    };
  }

  render() {
    const { soknad } = this.props;

    return (
      <article aria-labelledby={`soknader-header-${soknad.id}`}>
        <button
          className="inngangspanel inngangspanel--inaktivt"
          onClick={(e) => {
            e.preventDefault();
            this.setState({
              vis: true,
            });
          }}
        >
          <span className="inngangspanel__ikon">
            <img
              alt=""
              className="js-ikon"
              src="/sykefravaer/img/svg/soknader.svg"
            />
          </span>
          <div className="inngangspanel__innhold">
            <header className="inngangspanel__header">
              <h3 className="js-title" id={`soknad-header-${soknad.id}`}>
                <small className="inngangspanel__meta js-meta">
                  {textDatoFremtidig(tilLesbarDatoMedArstall(soknad.tom))}
                </small>
                <span className="inngangspanel__tittel">{texts.tittel}</span>
              </h3>
              <p className="inngangspanel__status js-status">
                {textSoknadStatus(soknad.status)}
              </p>
            </header>
            <p className="inngangspanel__tekst js-tekst">
              {textTeaserText(
                tilLesbarPeriodeMedArstall(soknad.fom, soknad.tom)
              )}
            </p>
            {soknad.arbeidsgiver && (
              <p className="inngangspanel__undertekst js-undertekst mute">
                {soknad.arbeidsgiver.navn}
              </p>
            )}
          </div>
        </button>
        {this.state.vis && (
          <SoknadLightbox
            soknad={soknad}
            onClose={() => {
              this.setState({
                vis: false,
              });
            }}
          />
        )}
      </article>
    );
  }
}

FremtidigSoknadTeaser.propTypes = {
  soknad: soknadEllerSykepengesoknad,
};

export default FremtidigSoknadTeaser;
