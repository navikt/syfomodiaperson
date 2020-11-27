import React from "react";
import PropTypes from "prop-types";
import { tilLesbarDatoMedArstall } from "@navikt/digisyfo-npm";
import OppfoelgingsdialogIkon from "../../ikoner/OppfoelgingsdialogIkon";
import MoteIkon from "../../ikoner/MoteIkon";
import LederIkon from "../../ikoner/LederIkon";

const hentIkon = (event) => {
  switch (event.kilde) {
    case "MOTER":
    case "MOTEBEHOV": {
      return <MoteIkon />;
    }
    case "OPPFOELGINGSDIALOG": {
      return <OppfoelgingsdialogIkon />;
    }
    case "LEDER": {
      return <LederIkon />;
    }
    default: {
      return null;
    }
  }
};

const HistorikkEvent = ({ event }) => {
  return (
    <li className="historikkevent">
      <p className="historikkevent__meta">
        {tilLesbarDatoMedArstall(event.tidspunkt)}
      </p>
      <div className="historikkevent__info">
        <div className="historikkevent__ikon">{hentIkon(event)}</div>
        <p className="historikkevent__tekst">{event.tekst}</p>
      </div>
    </li>
  );
};

HistorikkEvent.propTypes = {
  event: PropTypes.object,
};

export default HistorikkEvent;
