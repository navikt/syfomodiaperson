import React from "react";
import Panel from "nav-frontend-paneler";
import PropTypes from "prop-types";

const Speilingvarsel = ({ brukernavn }) => {
  return (
    <Panel className="panel panel--komprimert blokk--s">
      <p>
        Dette er slik <strong>{brukernavn}</strong> ser det på nav.no
      </p>
    </Panel>
  );
};

Speilingvarsel.propTypes = {
  brukernavn: PropTypes.string,
};

export default Speilingvarsel;
