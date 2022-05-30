import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import AlertStripe from "nav-frontend-alertstriper";
import KnappBase from "nav-frontend-knapper";
import * as epostinnholdActions from "../../../data/mote/epostinnhold_actions";
import Innholdsviser from "./Innholdsviser";
import Epostmottakere from "./Epostmottakere";
import { motePt } from "../moteProptypes";

const texts = {
  overskrift: "Avbryt møteforespørsel",
  feil: "Beklager, det oppstod en…Prøv igjen litt senere.",
  avbryt: "Avbryt",
  submit: "Send",
};

export const mapStateToInnholdsviserProps = (state) => {
  return {
    epostinnhold: state.epostinnhold.data,
    arbeidstaker: state.navbruker.data,
    henter: state.epostinnhold.henter || state.navbruker.henter,
    hentingFeilet: state.epostinnhold.hentingFeilet || state.navbruker.henter,
  };
};

const actions = Object.assign({}, epostinnholdActions, {
  hentEpostinnhold: epostinnholdActions.hentAvbrytMoteEpostinnhold,
});

export const InnholdsviserContainer = connect(
  mapStateToInnholdsviserProps,
  actions
)(Innholdsviser);

const AvbrytMote = (props) => {
  const {
    mote,
    avbrytFeilet,
    avbryter,
    avbrytHref,
    onSubmit,
    arbeidstaker,
  } = props;

  return (
    <div className="epostinnhold">
      <h2 className="epostinnhold__tittel">{texts.overskrift}</h2>
      <Epostmottakere mote={mote} arbeidstaker={arbeidstaker} />
      <InnholdsviserContainer mote={mote} />
      <div aria-live="polite" role="alert">
        {avbrytFeilet && (
          <div className="blokk">
            <AlertStripe type="advarsel">
              <p>{texts.feil}</p>
            </AlertStripe>
          </div>
        )}
      </div>
      <div className="blokk--s">
        <KnappBase
          type="hoved"
          spinner={avbryter}
          disabled={avbryter}
          className="knapp--enten"
          onClick={onSubmit}
        >
          {texts.submit}
        </KnappBase>
        <Link className="lenke" to={avbrytHref}>
          {texts.avbryt}
        </Link>
      </div>
    </div>
  );
};

AvbrytMote.propTypes = {
  arbeidstaker: PropTypes.object,
  onSubmit: PropTypes.func,
  avbrytHref: PropTypes.string,
  avbryter: PropTypes.bool,
  avbrytFeilet: PropTypes.bool,
  mote: motePt,
};

export default AvbrytMote;
