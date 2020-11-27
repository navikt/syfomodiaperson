import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";

const Tilbakelenke = ({ to, tekst }) => {
  return (
    <div className="blokk">
      <Link to={to} className="tilbakelenke">
        {tekst}
      </Link>
    </div>
  );
};

Tilbakelenke.propTypes = {
  to: PropTypes.string,
  tekst: PropTypes.string,
};

export default Tilbakelenke;
