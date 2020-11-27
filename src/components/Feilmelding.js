import React from "react";
import PropTypes from "prop-types";
import Panel from "nav-frontend-paneler";

const Feilmelding = ({
  tittel = "Beklager, det oppstod en feil",
  melding = { __html: "<p>Vennligst prøv igjen litt senere.</p>" },
}) => {
  return (
    <Panel className="panel--melding">
      <h3 className="hode hode--feil">{tittel}</h3>
      <div dangerouslySetInnerHTML={melding} />
    </Panel>
  );
};

Feilmelding.propTypes = {
  tittel: PropTypes.string,
  melding: PropTypes.object,
};

export default Feilmelding;
