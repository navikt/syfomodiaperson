import React from "react";
import PropTypes from "prop-types";
import { Row, Column } from "nav-frontend-grid";

export const BoksRad = ({ kolonne1Tekst, kolonne2Tekst, erTittel }) => {
  return (
    <Row>
      <Column className="col-sm-6">
        <p
          className={`sykmeldingMotebehovVisning__boksRad--${
            erTittel ? "tittel" : "tekst"
          }`}
        >
          {kolonne1Tekst}
        </p>
      </Column>
      <Column className="col-sm-6">
        <p
          className={`sykmeldingMotebehovVisning__boksRad--${
            erTittel ? "tittel" : "tekst"
          }`}
        >
          {kolonne2Tekst}
        </p>
      </Column>
    </Row>
  );
};

BoksRad.propTypes = {
  kolonne1Tekst: PropTypes.string,
  kolonne2Tekst: PropTypes.string,
  erTittel: PropTypes.bool,
};

export default BoksRad;
