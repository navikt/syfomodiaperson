import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import { connect } from "react-redux";
import AlertStripe from "nav-frontend-alertstriper";
import KnappBase from "nav-frontend-knapper";
import { keyValue } from "@navikt/digisyfo-npm";
import * as motePropTypes from "../../propTypes";
import Epostmottakere from "./Epostmottakere";
import Innholdsviser from "./Innholdsviser";
import { mapStateToInnholdsviserProps } from "./AvbrytMote";

export const InnholdsviserContainer = connect(mapStateToInnholdsviserProps)(
  Innholdsviser
);

export const tekster = {
  mote: {
    bekreftmote: {
      feil: "Det skjedde en feil",
      lightboxOverskrift: "Send bekreftelse på møtetidspunkt",
      lightboxSendKnapp: "Send bekreftelse",
      lightboxAvbrytKnapp: "Avbryt",
    },
  },
};

const BekreftMoteSkjema = (props) => {
  const {
    mote,
    ledetekster,
    bekrefter,
    bekreftFeilet,
    onSubmit,
    avbrytHref,
    hentEpostinnhold,
    arbeidstaker,
  } = props;

  return (
    <div className="epostinnhold">
      <h2 className="epostinnhold__tittel">
        {tekster.mote.bekreftmote.lightboxOverskrift}
      </h2>
      <Epostmottakere
        mote={mote}
        ledetekster={ledetekster}
        arbeidstaker={arbeidstaker}
      />
      <InnholdsviserContainer
        mote={mote}
        hentEpostinnhold={hentEpostinnhold}
        ledetekster={ledetekster}
      />
      <div aria-live="polite" role="alert">
        {bekreftFeilet && (
          <div className="blokk">
            <AlertStripe type="advarsel">
              <p>{tekster.mote.bekreftmote.feil}</p>
            </AlertStripe>
          </div>
        )}
      </div>
      <div className="blokk--s">
        <KnappBase
          type="hoved"
          spinner={bekrefter}
          disabled={bekrefter}
          className="blokk--s knapp--enten"
          onClick={onSubmit}
        >
          {tekster.mote.bekreftmote.lightboxSendKnapp}
        </KnappBase>
        <Link to={avbrytHref} className="lenke">
          {tekster.mote.bekreftmote.lightboxAvbrytKnapp}
        </Link>
      </div>
    </div>
  );
};
BekreftMoteSkjema.propTypes = {
  ledetekster: keyValue,
  arbeidstaker: PropTypes.object,
  onSubmit: PropTypes.func,
  avbrytHref: PropTypes.string,
  mote: motePropTypes.motePt,
  bekrefter: PropTypes.bool,
  bekreftFeilet: PropTypes.bool,
  hentEpostinnhold: PropTypes.func,
};

export default BekreftMoteSkjema;
