import React from "react";
import Panel from "nav-frontend-paneler";
import Infomelding from "../Infomelding";
import Sidetopp from "../Sidetopp";

const IngenHistorikk = () => {
  return (
    <div>
      <Sidetopp tittel="Logg" />
      <Panel>
        <Infomelding
          tittel="Denne personen har ingen oppfølgingshistorikk"
          melding="Når en sykmeldt blir fulgt opp så vil oppfølgingen bli loggført her slik at du får oversikt over hva som har skjedd og hvem som har vært involvert i oppfølgingen."
        />
      </Panel>
    </div>
  );
};

export default IngenHistorikk;
