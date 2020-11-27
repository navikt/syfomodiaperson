import React from "react";
import PropTypes from "prop-types";
import {
  erMotebehovBehandlet,
  harUbehandletMotebehov,
  hentSistBehandletMotebehov,
} from "../../utils/motebehovUtils";
import { Checkbox } from "nav-frontend-skjema";
import { toDatePrettyPrint } from "@navikt/digisyfo-npm";

export const behandleMotebehov = (
  actions,
  fnr,
  veilederinfo,
  motebehovListe
) => {
  if (harUbehandletMotebehov(motebehovListe)) {
    actions.behandleMotebehov(fnr, veilederinfo.ident);
  }
};

const behandleMotebehovKnappLabel = (erBehandlet, sistBehandletMotebehov) => {
  return erBehandlet
    ? `Ferdigbehandlet av ${
        sistBehandletMotebehov.behandletVeilederIdent
      } ${toDatePrettyPrint(sistBehandletMotebehov.behandletTidspunkt)}`
    : "Marker som behandlet";
};

export const BehandleMotebehovKnapp = ({
  actions,
  fnr,
  motebehovListe,
  veilederinfo,
}) => {
  const sistBehandletMotebehov = hentSistBehandletMotebehov(motebehovListe);
  const erBehandlet = erMotebehovBehandlet(motebehovListe);

  return (
    <div className="panel behandleMotebehovKnapp">
      <div className="skjema__input">
        <Checkbox
          label={behandleMotebehovKnappLabel(
            erBehandlet,
            sistBehandletMotebehov
          )}
          onClick={() => {
            behandleMotebehov(actions, fnr, veilederinfo, motebehovListe);
          }}
          id="marker__utfoert"
          disabled={erBehandlet}
          checked={erBehandlet}
        />
      </div>
    </div>
  );
};

BehandleMotebehovKnapp.propTypes = {
  actions: PropTypes.object,
  fnr: PropTypes.string,
  motebehovListe: PropTypes.arrayOf(PropTypes.object),
  veilederinfo: PropTypes.object,
};

export default BehandleMotebehovKnapp;
