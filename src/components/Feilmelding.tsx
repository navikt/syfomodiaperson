import React from "react";
import Panel from "nav-frontend-paneler";
import { Normaltekst } from "nav-frontend-typografi";

interface FeilmeldingProps {
  tittel?: string;
  melding?: string;
}

const Feilmelding = ({
  tittel = "Beklager, det oppstod en feil",
  melding = "Vennligst prøv igjen litt senere.",
}: FeilmeldingProps) => {
  return (
    <Panel id="feilmelding" className="panel--melding">
      <h3 className="hode hode--feil">{tittel}</h3>
      <Normaltekst>{melding}</Normaltekst>
    </Panel>
  );
};

export default Feilmelding;
