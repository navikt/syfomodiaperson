import React from "react";
import PropTypes from "prop-types";
import AlertStripe from "nav-frontend-alertstriper";

const KontaktInfoFeilmelding = ({ melding }) => {
  return (
    <div className="panel">
      <AlertStripe type="advarsel">
        <div dangerouslySetInnerHTML={melding} />
      </AlertStripe>
    </div>
  );
};

KontaktInfoFeilmelding.propTypes = {
  melding: PropTypes.object,
};

export default KontaktInfoFeilmelding;
