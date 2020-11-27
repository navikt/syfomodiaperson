import React from "react";
import { Row } from "nav-frontend-grid";
import NavFrontendSpinner from "nav-frontend-spinner";

const AppSpinner = () => {
  return (
    <Row
      className="row-centered blokk--xl"
      aria-label="Vent litt mens siden laster"
    >
      <NavFrontendSpinner type="XL">
        Vent litt mens siden laster
      </NavFrontendSpinner>
    </Row>
  );
};

export default AppSpinner;
