import React from "react";
import PropTypes from "prop-types";
import Alertstripe from "nav-frontend-alertstriper";

const Feilstripe = ({
  vis,
  className,
  tekst = "Beklager, det oppstod en feil! Vennligst prøv igjen senere.",
}) => {
  return (
    <div aria-live="polite" role="alert">
      {vis ? (
        <Alertstripe type="advarsel" className={className}>
          <p className="sist">{tekst}</p>
        </Alertstripe>
      ) : null}
    </div>
  );
};

Feilstripe.propTypes = {
  vis: PropTypes.bool,
  className: PropTypes.string,
  tekst: PropTypes.string,
};

export default Feilstripe;
