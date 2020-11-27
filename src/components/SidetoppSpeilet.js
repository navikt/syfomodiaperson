import React from "react";
import PropTypes from "prop-types";

const SidetoppSpeilet = ({ tittel, htmlTekst }) => {
  return (
    <header className="sidetoppSpeilet">
      <h1 className="sidetoppSpeilet__tittel">{tittel}</h1>
      {htmlTekst && (
        <div className="sidetoppSpeilet__intro side-innhold js-intro">
          <p dangerouslySetInnerHTML={htmlTekst} />
        </div>
      )}
    </header>
  );
};

SidetoppSpeilet.propTypes = {
  tittel: PropTypes.string.isRequired,
  htmlTekst: PropTypes.object,
};

export default SidetoppSpeilet;
