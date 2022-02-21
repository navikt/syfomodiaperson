import * as React from "react";
import Infomelding from "../../Infomelding";

const IngenPlaner = () => {
  return (
    <div>
      <div className="panel">
        <h2 style={{ margin: 0 }}>Oppfølgingsplaner</h2>
      </div>
      <Infomelding
        tittel="NAV har ikke mottatt noen oppfølgingsplaner"
        melding="For å se oppfølgingsplaner her må den sykmeldte eller nærmeste leder sende den inn fra sin side på nav.no"
      />
    </div>
  );
};

export default IngenPlaner;
