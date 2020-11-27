import React, { useState } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import Knapp from "nav-frontend-knapper";
import { behandlePersonOppgave } from "../../../actions/personoppgave_actions";

export const BehandleOppfolgingsplanLPS = ({
  oppfolgingsplanLPS,
  veilederIdent,
}) => {
  const dispatch = useDispatch();
  const opLPSPersonOppgave = oppfolgingsplanLPS.personoppgave;
  const [spinner, setSpinner] = useState(false);

  const markerSomBehandlet = () => {
    setSpinner(true);
    dispatch(
      behandlePersonOppgave(
        opLPSPersonOppgave.uuid,
        oppfolgingsplanLPS.uuid,
        veilederIdent
      )
    );
  };

  return (
    <Knapp
      onClick={markerSomBehandlet}
      spinner={spinner}
      id="behandle_personoppgave"
      mini
    >
      Marker som behandlet
    </Knapp>
  );
};

BehandleOppfolgingsplanLPS.propTypes = {
  oppfolgingsplanLPS: PropTypes.object,
  veilederIdent: PropTypes.string,
};

export default BehandleOppfolgingsplanLPS;
