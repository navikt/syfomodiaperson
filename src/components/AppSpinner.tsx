import React from "react";
import { Loader } from "@navikt/ds-react";

const AppSpinner = () => {
  return (
    <div
      className="flex justify-center mb-16"
      aria-label="Vent litt mens siden laster"
    >
      <Loader size="2xlarge" title="Venter...">
        Vent litt mens siden laster
      </Loader>
    </div>
  );
};

export default AppSpinner;
